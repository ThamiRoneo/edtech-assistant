from fastapi.testclient import TestClient

from app.main import app


class FakeConn:
    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def execute(self, statement):
        return None


class FakeRedis:
    def __init__(self, fail=False):
        self.fail = fail

    def ping(self):
        if self.fail:
            raise RuntimeError("redis down")
        return True


def test_readyz_reports_ok_when_db_and_redis_are_available(monkeypatch):
    monkeypatch.setattr("app.main.db_core.engine.connect", lambda: FakeConn())
    monkeypatch.setattr("app.main.redis_core.get_redis", lambda: FakeRedis())

    response = TestClient(app).get("/readyz")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "db": True, "redis": True}


def test_readyz_reports_unhealthy_when_db_is_unavailable(monkeypatch):
    def fail_connect():
        raise RuntimeError("db down")

    monkeypatch.setattr("app.main.db_core.engine.connect", fail_connect)
    monkeypatch.setattr("app.main.redis_core.get_redis", lambda: FakeRedis())

    response = TestClient(app).get("/readyz")

    assert response.status_code == 503
    assert response.json() == {"status": "unhealthy", "db": False, "redis": True}


def test_readyz_reports_unhealthy_when_redis_is_unavailable(monkeypatch):
    monkeypatch.setattr("app.main.db_core.engine.connect", lambda: FakeConn())
    monkeypatch.setattr("app.main.redis_core.get_redis", lambda: FakeRedis(fail=True))

    response = TestClient(app).get("/readyz")

    assert response.status_code == 503
    assert response.json() == {"status": "unhealthy", "db": True, "redis": False}
