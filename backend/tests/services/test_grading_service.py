import asyncio
from app.services.grading import grading_service


def test_grading_service_builds_messages(monkeypatch):
    called = {}

    async def fake_grade_with_vision(self, messages, model=None):
        called["messages"] = messages
        return {"scores": [{"name": "x", "score": 1, "max": 1}], "total_score": 1, "max_score": 1, "feedback": "ok"}

    monkeypatch.setattr("app.services.llm.llm_client.grade_with_vision", fake_grade_with_vision)
    res = asyncio.get_event_loop().run_until_complete(grading_service.grade("2+2=?", [], [{"name": "x", "max_points": 1}]))
    assert res["total_score"] == 1
    assert called["messages"][0]["role"] == "system"
