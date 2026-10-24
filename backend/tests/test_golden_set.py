GOLDEN = [
    {"text": "2+2=4", "expected_min": 0.9},
    {"text": "Solve x+1=2 -> x=1", "expected_min": 0.9},
]


def test_golden_set_structure():
    assert len(GOLDEN) >= 2
    for g in GOLDEN:
        assert g["expected_min"] >= 0
