from app.services.ingestion import ingestion_service


def test_chunk_fallback():
    text = "a" * 2500
    chunks = ingestion_service.chunk_text(text, chunk_size=1000, chunk_overlap=200)
    assert len(chunks) >= 2
