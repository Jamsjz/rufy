from rhyming_detector import (
    get_consonant_pattern,
    get_syllables,
    get_vowel_family,
    VOWEL_MAP,
    CONSONANT_GROUPS,
    consonant_bonus,
    consonant_similarity,
    is_heavy_syllable,
    rhyme_score,
)
import pandas as pd
import numpy as np
from model import ft

all = pd.read_csv("words.csv")
common = pd.read_csv("common_words_in_poem.csv")


def get_topk_rhyming_words(word: str, k: int = 10):
    rhyming_words = []
    for wd in common.words:
        score = rhyme_score(word, wd, mode="loose", strict_alignment=True)
        if score > 3.5:
            rhyming_words.append({wd: score})

    rhyming_words.sort(key=lambda x: list(x.values())[0], reverse=True)

    words = [list(d.keys())[0] for d in rhyming_words][1:]

    if len(words) < k or k is None:
        return words
    else:
        return words[0:k]


def similarity_score(e1: list | np.ndarray, e2: list | np.ndarray) -> float:
    """
    Cosine similarity between two vectors.
    Handles 1D or 2D inputs (e.g., column/row vectors) by flattening to 1D.
    """
    v1 = np.asarray(e1, dtype=np.float64).ravel()  # flatten to 1D
    v2 = np.asarray(e2, dtype=np.float64).ravel()

    dot = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0

    return float(dot / (norm1 * norm2))


def get_similarity_score(ctx, word, vecfinder=ft.get_word_vector):
    lines = ctx.splitlines()
    lines = [line.strip() for line in lines if line.strip()]
    if not lines:
        return 0.0
    vectors = [ft.get_sentence_vector(line) for line in lines]
    vctx = np.mean(vectors, axis=0)
    vword = vecfinder(word)
    return similarity_score(vctx, vword)


def get_paragraph_vector(paragraph: str):
    lines = paragraph.splitlines()
    lines = [line.strip() for line in lines if line.strip()]
    if not lines:
        return np.zeros(300).tolist()

    vectors = [ft.get_sentence_vector(line) for line in lines]
    vctx = np.mean(vectors, axis=0)

    return vctx.tolist()
