import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

ratings = pd.read_csv("data/ratings.csv")

user_item_matrix = ratings.pivot(
    index="userId",
    columns="movieId",
    values="rating"
)
## print(user_item_matrix.head())

item_user_matrix = user_item_matrix.T.fillna(0)

item_similarity = cosine_similarity(item_user_matrix)
item_similarity_df = pd.DataFrame(
    item_similarity,
    index=item_user_matrix.index,
    columns=item_user_matrix.index
)

def recommend_movies_item_based(user_id, n_recommendations=10):
    user_ratings = user_item_matrix.loc[user_id].dropna()

    scores = {}

    for movie, rating in user_ratings.items():
        similar_movies = item_similarity_df[movie]

        for similar_movie, similarity in similar_movies.items():
            if similar_movie not in user_ratings:
                scores.setdefault(similar_movie, 0)
                scores[similar_movie] += similarity * rating

    ranked_movies = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return ranked_movies[:n_recommendations]

movies = pd.read_csv("data/movies.csv")

movie_id_to_title = dict(
    zip(movies["movieId"], movies["title"])
)

def get_movie_title(movie_id):
    return movie_id_to_title.get(movie_id, "Título desconhecido")

def recommend_movies_item_based_with_titles(user_id, n_recommendations=5):
    recommendations = recommend_movies_item_based(
        user_id, n_recommendations
    )

    result = []
    for movie_id, score in recommendations:
        title = get_movie_title(movie_id)
        result.append({
            "movieId": movie_id,
            "title": title,
            "score": round(score, 2)
        })

    return result

print (recommend_movies_item_based_with_titles(user_id=1))