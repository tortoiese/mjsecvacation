# Python Port Scanner

네트워크 기초 4주차 과제 — `socket` 모듈로 만든 TCP 포트 스캐너입니다.

> ⚠️ 본인 소유이거나 스캔이 허가된 호스트(127.0.0.1, 직접 띄운 서버, scanme.nmap.org)에만 사용하세요.

## 파일 구성

| 파일 | 설명 |
|---|---|
| `scanner1.py` | Level 1. 입력을 받아 순차적으로 스캔 |
| `scanner.py` | Level 2. argparse + 멀티스레드 + 서비스 이름 추정 |

## 실행 방법

```bash
# Level 1 (대화형 입력)
python3 scanner1.py

# Level 2
python3 scanner.py --host 127.0.0.1 --ports 1-1000
python3 scanner.py --host 127.0.0.1 --ports 22,80,443 --threads 100
python3 scanner.py --host 127.0.0.1 --ports 1-1000 --benchmark
```

### 옵션

| 옵션 | 기본값 | 설명 |
|---|---|---|
| `--host` | (필수) | 대상 IP 또는 도메인 |
| `--ports` | 1-1024 | `1-1000`, `22,80,443`, `1-100,8080` 형식 지원 |
| `--threads` | 50 | 동시 스레드 개수 |
| `--timeout` | 1.0 | 포트당 응답 대기 시간(초) |
| `--show-closed` | off | 닫힌 포트도 출력 |
| `--benchmark` | off | 순차 vs 스레드 소요 시간 비교 |

## 실행 결과

```
Scanning 127.0.0.1 (127.0.0.1) (ports 1-1000) with 50 threads...

Port   135 (msrpc): OPEN
Port   445 (smb): OPEN
Port   808 (unknown): OPEN

Scan finished in 20.30s (open: 3, closed: 997)

```

## 구현 과정

1. **소켓 연결 시도 부분부터 작성** — `socket.socket(AF_INET, SOCK_STREAM)`으로 TCP 소켓을 만들고 `connect_ex()`의 반환값이 0인지 확인.
2. **타임아웃 설정** — 처음엔 `settimeout()`을 안 넣고 돌렸는데, 필터링된(응답 없는) 포트가 하나라도 섞이면 그 포트에서 한참을 멈춰있었다. OS 기본 타임아웃이 꽤 길게 잡혀있어서 그런 거였고, `settimeout(1.0)`을 넣고 나서야 스캔이 제 속도로 돌아감.
3. **포트 범위 파싱** — `"1-1000"` 문자열을 정수 리스트로 변환.
4. **멀티스레딩 적용** — 처음엔 포트마다 `threading.Thread`를 그냥 다 띄웠는데, 1000개 스캔하니까 `OSError: [Errno 24] Too many open files`가 났다. `ThreadPoolExecutor`로 바꾸고 `max_workers`로 동시에 뜨는 스레드 수를 제한하니까 해결.
5. **서비스 이름 매핑** — `socket.getservbyport()`를 그냥 쓰면 3000, 6379, 8080처럼 개발할 때 자주 열어두는 포트에서 `OSError`(service/proto not found)가 났다. `/etc/services`에 등록 안 된 포트라 그런 거라서, 자주 보는 포트는 `COMMON_SERVICES`에 직접 박아두고 나머지만 `getservbyport`로 넘기게 함.
6. **argparse 적용** — CLI 인자 처리.

### 삽질 기록

- `settimeout()` 빠뜨림 → 필터링된 포트 만나면 스캔이 멈춘 것처럼 느려짐 → 타임아웃 명시적으로 걸어서 해결.
- 스레드를 제한 없이 다 띄움 → `OSError: [Errno 24] Too many open files` → `ThreadPoolExecutor(max_workers=...)`로 동시 실행 개수 제한.
- `getservbyport()`가 흔한 개발용 포트(3000, 5000, 6379 등)에서 예외를 던짐 → `COMMON_SERVICES` 딕셔너리로 자주 쓰는 포트는 직접 매핑, 나머진 `getservbyport`에 위임.

## 속도 측정 결과

`--benchmark` 옵션으로 측정했습니다.

| 방식 | 대상 | 포트 수 | 소요 시간 |
|---|---|---|---|
| 순차 | 127.0.0.1 | 1-1000 | 1316.25s |
| 스레드 50개 | 127.0.0.1 | 1-1000 | 20.27s |

약 64.9배 빨라짐 (열린 포트: 135, 445, 808 — 동일)

측정 환경: Windows, Python 3.14.3, timeout 1.0s

**분석:**
포트 스캔은 CPU를 쓰는 연산이 아니라 상대 응답을 '기다리는' I/O 작업이다. 순차 스캔은 포트 하나 처리가 끝날 때까지 다음 포트를 아예 시작도 못 하니까 대기 시간이 그대로 다 누적되는데, 스레드로 돌리면 한 스레드가 응답을 기다리는 동안 GIL이 다른 스레드로 넘어가서 여러 포트를 동시에 대기시킬 수 있다.

특히 이번 결과에서 순차 스캔이 1316초나 걸린 건, 닫힌 997개 포트 대부분이 즉시 RST를 안 주고 Windows 방화벽 선에서 그냥 조용히 드롭당해서 포트마다 `timeout(1.0s)`을 거의 다 채우고 넘어갔기 때문이다(1000개 × 약 1.3초 ≈ 1316초). 스레드 스캔은 이 대기를 50개씩 동시에 돌리니까 전체 시간이 대기시간/동시개수 수준으로 줄어서 20초대에 끝났다.

## 체크포인트 질문

### 1. 포트 하나를 확인할 때 3-Way Handshake는 어느 단계까지 일어나는가?

`connect_ex()`는 raw SYN만 보내는 게 아니라 커널이 실제 TCP 연결을 끝까지 맺도록 시키는 함수라서, 포트 상태에 따라 handshake가 어디까지 진행되는지가 갈린다.

- 열린 포트일 때: SYN → SYN-ACK → ACK까지 3-way handshake가 전부 끝나고 실제 연결이 맺어짐. `with` 블록을 빠져나오면서 소켓을 닫으니 이후 FIN(또는 RST)으로 바로 종료됨.
- 닫힌 포트일 때: SYN을 보내자마자 상대가 RST로 바로 거절해서 handshake 자체가 1단계에서 끝남. `connect_ex()`는 `ECONNREFUSED`를 반환.
- 방화벽이 막았을 때: SYN이 그냥 드롭당해서 응답이 아예 안 옴. handshake는 시작도 못 하고, `settimeout()`으로 걸어둔 시간만큼 기다리다가 타임아웃으로 포기함(그래서 filtered 상태를 timeout으로 짐작).

### 2. `connect_ex`와 `connect`의 차이는? 왜 스캐너에는 `connect_ex`가 적합한가?

`connect()`는 연결에 실패하면 예외(`socket.error`)를 던져서 매번 `try/except`로 감싸야 한다. 반면 `connect_ex()`는 예외 대신 정수 반환값(성공하면 0, 실패하면 errno)을 주기 때문에 `if result == 0` 같은 조건문으로 바로 처리할 수 있다. 포트 스캐너는 수백~수천 개 포트를 반복문으로 돌리는 구조라서, 매번 예외를 던지고 잡는 것보다 반환값만 확인하는 `connect_ex()` 쪽이 코드도 간결하고 오버헤드도 적다.

### 3. 스레드를 너무 많이 띄우면 어떤 문제가 생기는가?

- 소켓 하나가 파일 디스크립터 하나를 차지하는데, 스레드를 무제한으로 띄우면 OS의 파일 디스크립터 한도를 넘어서 `Too many open files` 같은 에러가 난다(실제로 겪음, 위 삽질 기록 참고).
- 스레드 생성/컨텍스트 스위칭 자체에도 비용이 들기 때문에, 일정 개수를 넘어가면 오히려 오버헤드 때문에 스캔이 더 느려질 수 있다.
- 짧은 시간에 SYN 패킷이 몰리면 대상 서버나 중간 방화벽 입장에서는 스캔을 공격(SYN flood 비슷한 패턴)으로 인식해서 차단(rate-limit)할 수도 있다.

## 참고 자료

- Python 공식 문서 — `socket`, `concurrent.futures`, `argparse`
- Nmap 공식 문서 — Port Scanning Techniques