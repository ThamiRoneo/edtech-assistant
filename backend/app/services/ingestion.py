try:
    from pypdf import PdfReader
except Exception:
    PdfReader = None
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except Exception:
    RecursiveCharacterTextSplitter = None

from typing import List, Dict, Any
import io


class IngestionService:
    def extract_text(self, filename: str, content: bytes) -> str:
        if filename.lower().endswith(".pdf") and PdfReader:
            try:
                reader = PdfReader(io.BytesIO(content))
                texts = []
                for p in reader.pages:
                    texts.append(p.extract_text() or "")
                return "\n\n".join(texts)
            except Exception:
                return ""
        # plain text
        try:
            return content.decode("utf-8", errors="ignore")
        except Exception:
            return ""

    def chunk_text(self, text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
        if RecursiveCharacterTextSplitter:
            splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
            return splitter.split_text(text)
        # simple fallback
        chunks = []
        i = 0
        while i < len(text):
            chunks.append(text[i : i + chunk_size])
            i += chunk_size - chunk_overlap
        return chunks


ingestion_service = IngestionService()
