# -*- coding: utf-8 -*-
"""
Complete rhyme detection for Devanagari (Hindi/Sanskrit)
with fixed syllable segmentation and all advanced features.
"""

import re

# ========== FIXED SYLLABLE SEGMENTATION ==========
def get_syllables(word):
    """
    Parse Devanagari word into syllables.
    Rules:
    - Independent vowel → single syllable.
    - Consonant + optional halant + optional vowel sign → one syllable.
    - A consonant that is NOT followed by halant and is followed by another consonant
      indicates that the first consonant has its inherent vowel, so it ends a syllable.
    """
    vowels = set('अआइईउऊऋएऐओऔ')
    vowel_signs = set('ािीुूृेैोौ')
    halant = '्'
    
    syllables = []
    current = []
    i = 0
    n = len(word)
    
    while i < n:
        ch = word[i]
        if ch in vowels:                     # Independent vowel
            if current:
                syllables.append(''.join(current))
                current = []
            current.append(ch)
            syllables.append(''.join(current))
            current = []
            i += 1
        elif ch == halant:                   # Halant – stays in current syllable
            if current:
                current.append(ch)
            i += 1
        elif ch in vowel_signs:              # Vowel sign – ends current syllable
            if current:
                current.append(ch)
                syllables.append(''.join(current))
                current = []
            else:
                # Should not happen, but fallback
                syllables.append(ch)
            i += 1
        else:                               # Consonant
            # If current syllable exists and it does NOT end with a halant,
            # then the previous consonant had an inherent vowel → finalize it.
            if current and current[-1] != halant:
                syllables.append(''.join(current))
                current = []
            current.append(ch)
            i += 1
    
    if current:
        syllables.append(''.join(current))
    return syllables

# ========== VOWEL MAPPING & CONFIGURABLE MODES ==========
VOWEL_MAP = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
    'ा': 'aa', 'ि': 'i', 'ी': 'ii', 'ु': 'u', 'ू': 'uu',
    'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au'
}

def get_vowel_family(raw_vowel, mode):
    if mode == 'strict':
        return raw_vowel
    families = {}
    if mode == 'loose':
        families = {'i': ['i','ii'], 'u': ['u','uu']}
    elif mode == 'very_loose':
        families = {
            'a': ['a','aa'],
            'i': ['i','ii'],
            'u': ['u','uu'],
            'e': ['e','ai'],
            'o': ['o','au']
        }
    else:
        families = {'i': ['i','ii'], 'u': ['u','uu']}
    for fam, members in families.items():
        if raw_vowel in members:
            return fam
    return raw_vowel

def get_vowel_sound(syl, mode, ignore_nasal):
    if ignore_nasal:
        syl = syl.replace('ं', '').replace('ँ', '')
    if syl in VOWEL_MAP and len(syl) == 1:
        raw = VOWEL_MAP[syl]
    else:
        raw = 'a'
        for matra, sound in VOWEL_MAP.items():
            if matra in syl and len(matra) == 1:
                raw = sound
                break
    return get_vowel_family(raw, mode)

def get_consonant_pattern(syl, ignore_nasal):
    if ignore_nasal:
        syl = syl.replace('ं', '').replace('ँ', '')
    for v in VOWEL_MAP:
        syl = syl.replace(v, '')
    return syl

# ========== CONSONANT SIMILARITY ==========
CONSONANT_GROUPS = {
    'velar': set('कखगघङ'),
    'palatal': set('चछजझञ'),
    'retroflex': set('टठडढण'),
    'dental': set('तथदधन'),
    'labial': set('पफबभम'),
    'semivowel': set('यरलव'),
    'fricative': set('शषसह')
}

def consonant_similarity(c1, c2):
    if c1 == c2:
        return 1.0
    if len(c1) == 1 and len(c2) == 1:
        for group in CONSONANT_GROUPS.values():
            if c1 in group and c2 in group:
                return 0.5
        return 0.0
    common = sum(1 for a, b in zip(c1, c2) if a == b)
    if len(c1) == len(c2):
        return (common / len(c1)) * 0.8
    return 0.2 if common > 0 else 0.0

def consonant_bonus(cons1, cons2):
    if cons1 == cons2:
        return 0.5
    sonorants = set('यरलवह')
    if (cons1 == '' and len(cons2) == 1 and cons2 in sonorants) or \
       (cons2 == '' and len(cons1) == 1 and cons1 in sonorants):
        return 0.25
    return consonant_similarity(cons1, cons2) * 0.5

# ========== SYLLABLE WEIGHT ==========
def is_heavy_syllable(syl, vowel_sound):
    long_vowels = {'aa', 'ii', 'uu', 'ri', 'e', 'ai', 'o', 'au'}
    if vowel_sound in long_vowels:
        return True
    if '्' in syl:
        return True
    return False

# ========== WEIGHTED MIDDLE MATCH ==========
def weighted_middle_match(middle_pairs, mode, ignore_nasal):
    if not middle_pairs:
        return 0.0
    total_weight = 0.0
    match_weight = 0.0
    for i, (s1, s2) in enumerate(middle_pairs):
        weight = 0.8 ** i
        total_weight += weight
        v1 = get_vowel_sound(s1, mode, ignore_nasal)
        v2 = get_vowel_sound(s2, mode, ignore_nasal)
        if v1 == v2:
            match_weight += weight
    return (match_weight / total_weight) * 2.0 if total_weight else 0.0

# ========== MAIN RHYME SCORE ==========
def rhyme_score(w1, w2, mode='loose', ignore_nasal=True, strict_alignment=None):
    """
    Compute rhyme score (0 to ~8). Higher = better rhyme.
    If strict_alignment is True, both first and last aligned vowels must match.
    If False, allow last-match-only (as before).
    By default, strict_alignment = (mode != 'very_loose').
    """
    w1s = get_syllables(w1)
    w2s = get_syllables(w2)
    if not w1s or not w2s:
        return 0.0

    # Set strict_alignment default based on mode
    if strict_alignment is None:
        strict_alignment = (mode != 'very_loose')

    # Syllable difference penalty (light, kept for safety)
    syl_diff = abs(len(w1s) - len(w2s))
    syl_penalty = 0.0
    if syl_diff >= 2:
        syl_penalty = -0.5   # mild penalty
    elif syl_diff == 1:
        syl_penalty = -0.2

    min_len = min(len(w1s), len(w2s))
    aligned = [(w1s[-(i+1)], w2s[-(i+1)]) for i in range(min_len)]
    if not aligned:
        return 0.0

    last_pair = aligned[0]
    first_pair = aligned[-1]
    middle_pairs = aligned[1:-1]

    last_v1 = get_vowel_sound(last_pair[0], mode, ignore_nasal)
    last_v2 = get_vowel_sound(last_pair[1], mode, ignore_nasal)
    first_v1 = get_vowel_sound(first_pair[0], mode, ignore_nasal)
    first_v2 = get_vowel_sound(first_pair[1], mode, ignore_nasal)
    last_match = (last_v1 == last_v2)
    first_match = (first_v1 == first_v2)

    if first_match and last_match:
        base_score = 3.0
        middle_bonus = weighted_middle_match(middle_pairs, mode, ignore_nasal)
    elif not first_match and last_match:
        if strict_alignment:
            # For loose/strict mode, this is not allowed → score 0
            return 0.0
        else:
            base_score = 1.5
            middle_bonus = weighted_middle_match(middle_pairs, mode, ignore_nasal)
    else:
        base_score = -2.0
        middle_bonus = 0.0

    score = base_score + middle_bonus + syl_penalty

    # Consonant bonus (only if strict_alignment or last_match)
    if not strict_alignment or (first_match and last_match):
        cons1 = get_consonant_pattern(last_pair[0], ignore_nasal)
        cons2 = get_consonant_pattern(last_pair[1], ignore_nasal)
        score += consonant_bonus(cons1, cons2)

    # Syllable weight bonus
    heavy1 = is_heavy_syllable(last_pair[0], last_v1)
    heavy2 = is_heavy_syllable(last_pair[1], last_v2)
    if heavy1 == heavy2:
        score += 0.3

    # Length bonus (very small)
    if score >= 1.0:
        len_diff = abs(len(w1) - len(w2))
        if len_diff == 0:
            score += 0.5
        elif len_diff == 1:
            score += 0.25
        elif len_diff == 2:
            score += 0.1

    return max(0.0, score)

def rhymes(w1, w2, mode='loose', ignore_nasal=True):
    """Return True if rhyme_score meets threshold (2.5)."""
    return rhyme_score(w1, w2, mode, ignore_nasal) >= 2.5

# ========== TEST ==========
if __name__ == '__main__':
    test_pairs = [
        ("राम", "धाम"),
        ("जल", "फल"),
        ("रोपए", "खोपए"),
        ("प्रेम", "रेम"),
        ("पानी", "सानी"),
        ("रामायण", "राम"),
        ("रोपए", "खोए"),
        ("राम", "रामी"),
        ("गीत", "प्रीत"),
        ("कमला", "अमल"),
        ("एक", "मेक"),       # should rhyme
        ("का", "बा"),
        ("सुख", "सूख"),
        ("कि", "की"),
        ("के", "कै"),
        ("को", "कौ"),
    ]

    print("=== RHYME DETECTION TEST (mode='loose', ignore_nasal=True) ===")
    for w1, w2 in test_pairs:
        score = rhyme_score(w1, w2)
        result = rhymes(w1, w2)
        print(f"'{w1}' vs '{w2}': {result} (score = {score:.2f})")