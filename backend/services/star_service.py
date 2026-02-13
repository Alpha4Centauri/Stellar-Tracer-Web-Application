import pandas as pd

def get_star_properties(csv_path: str, index: int):
    df = pd.read_csv(csv_path)
    if index < 0 or index >= len(df):
        raise IndexError("Star index out of range")
    return df.iloc[index].to_dict()
