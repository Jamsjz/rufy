from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from qdrant_client import models
import random
import uuid
import numpy as np
from model import ft
from module import get_paragraph_vector

# client = QdrantClient(url="http://localhost:6333")
client = QdrantClient(":memory:")
COLLECTION_NAME = "fasttext_words"

if not client.collection_exists(COLLECTION_NAME):
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(size=300, distance=Distance.COSINE),
    )


def store_vector(word: str, vector: list):
    """
    Stores a word and its vector inside Qdrant.
    """
    point_id = str(uuid.uuid4())

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=point_id,
                vector=vector if isinstance(vector, list) else vector.tolist(),
                payload={"word": word},
            )
        ],
    )

def store_word(word: str):
    word_vector = ft.get_word_vector(word)
    store_vector(word, word_vector)

def get_topk_words(ctx: str, k: int = 10):
    """
    ctx is a multiline paragraph.
    Retrieves the top k most similar words from Qdrant.
    """
    vctx = get_paragraph_vector(ctx)

    # Query Qdrant using the paragraph vector
    search_result = client.query_points(
        collection_name=COLLECTION_NAME, query=vctx, limit=k, with_payload=True
    ).points

    top_k_words = [point.payload["word"] for point in search_result]
    return top_k_words

def get_word_vector(word: str):
    word_filter = models.Filter(
        must=[
            models.FieldCondition(key="word", match=models.MatchValue(value=word))
        ]
    )

    result = client.query_points(
        collection_name=COLLECTION_NAME,
        query_filter=word_filter,
        limit=1,
        with_vectors=True,
    ).points

    if result:
        return result[0].vector
    return None
