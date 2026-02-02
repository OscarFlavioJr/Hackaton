import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Carregar o CSV
ratings = pd.read_csv("data/ratings.csv")

# Criar a matriz usuário x filme
user_item_matrix = ratings.pivot(
    index="userId",
    columns="movieId",
    values="rating"
)
##print(user_item_matrix.head())

# Matriz item x usuário
item_user_matrix = user_item_matrix.T.fillna(0)

# Similaridade entre filmes
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

# Carregar o CSV de filmes
movies = pd.read_csv("data/movies.csv")

# Dicionário: movieId -> title
movie_id_to_title = dict(
    zip(movies["movieId"], movies["title"])
)

def get_movie_title(movie_id):
    return movie_id_to_title.get(movie_id, "Título desconhecido")

links = pd.read_csv("data/links.csv")

# movieId -> imdbId (string com zero à esquerda)
movie_id_to_imdb = {
    row.movieId: f"tt{int(row.imdbId):07d}"
    for row in links.itertuples()
    if not pd.isna(row.imdbId)
}

def get_imdb_id(movie_id):
    return movie_id_to_imdb.get(movie_id)

def recommend_movies_item_based_with_titles(user_id, n_recommendations=5):
    recommendations = recommend_movies_item_based(
        user_id, n_recommendations
    )

    result = []
    for movie_id, score in recommendations:
        title = get_movie_title(movie_id)
        result.append({
            "movieId": movie_id,
            "imdbId": get_imdb_id(movie_id),
            "title": title,
            "score": round(score, 2)
        })

    return result

print (recommend_movies_item_based_with_titles(user_id=1))