def test_total_score():
    scores = [{"score": 2, "max": 2}, {"score": 1, "max": 2}]
    total = sum(s["score"] for s in scores)
    maxs = sum(s["max"] for s in scores)
    assert total == 3
    assert maxs == 4
