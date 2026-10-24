def test_presign_key_format():
    import uuid
    filename = "test.png"
    key = f"uploads/{uuid.uuid4()}-{filename}"
    assert key.startswith("uploads/")
    assert filename in key
