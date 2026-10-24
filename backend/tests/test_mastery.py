def test_ema_update():
    alpha = 0.3
    old = 0.5
    new_score = 1.0
    updated = alpha * new_score + (1 - alpha) * old
    assert abs(updated - 0.65) < 1e-9
