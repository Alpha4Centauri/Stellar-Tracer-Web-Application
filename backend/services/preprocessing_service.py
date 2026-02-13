import pandas as pd
import numpy as np
import operator
from sklearn.preprocessing import StandardScaler
from typing import Optional, Tuple
from backend.utils.paths import new_data_path

GAIA_DR3_CONSTRAINTS = {
    "source_id": {"type": int},
    "ra": {"type": float},
    "ra_error": {"type": float, "min": 0},
    "dec": {"type": float},
    "dec_error": {"type": float, "min": 0},
    "parallax": {"type": float},
    "parallax_error": {"type": float, "min": 0},
    "parallax_over_error": {"type": float},
    "pm": {"type": float},
    "pmra": {"type": float},
    "pmra_error": {"type": float, "min": 0},
    "pmdec": {"type": float},
    "pmdec_error": {"type": float, "min": 0},
    "ra_dec_corr": {"type": float, "min": -1, "max": 1},
    "ra_parallax_corr": {"type": float, "min": -1, "max": 1},
    "ra_pmra_corr": {"type": float, "min": -1, "max": 1},
    "ra_pmdec_corr": {"type": float, "min": -1, "max": 1},
    "dec_parallax_corr": {"type": float, "min": -1, "max": 1},
    "dec_pmra_corr": {"type": float, "min": -1, "max": 1},
    "dec_pmdec_corr": {"type": float, "min": -1, "max": 1},
    "parallax_pmra_corr": {"type": float, "min": -1, "max": 1},
    "parallax_pmdec_corr": {"type": float, "min": -1, "max": 1},
    "pmra_pmdec_corr": {"type": float, "min": -1, "max": 1},
    "astrometric_excess_noise": {"type": float, "min": 0},
    "visibility_periods_used": {"type": int, "min": 0},
    "ruwe": {"type": float, "min": 0},
    "phot_g_mean_flux_over_error": {"type": float, "min": 0},
    "phot_g_mean_mag": {"type": float},
    "phot_bp_mean_flux_over_error": {"type": float, "min": 0},
    "phot_bp_mean_mag": {"type": float},
    "phot_rp_mean_flux_over_error": {"type": float, "min": 0},
    "phot_rp_mean_mag": {"type": float},
    "bp_rp": {"type": float},
    "phot_bp_rp_excess_factor": {"type": float, "min": 0},
    "radial_velocity": {"type": float},
    "radial_velocity_error": {"type": float, "min": 0},
}

def default_preprocessing(df: pd.DataFrame):
    df = df.dropna()

    df = df[
        (df['parallax'] > 0) &
        (df['pmra'] != 0) &
        (df['pmdec'] != 0) &
        (abs(df['pmra_error'] / df['pmra']) < 0.10) &
        (abs(df['pmdec_error'] / df['pmdec']) < 0.10) &
        (df['visibility_periods_used'] > 8) &
        (abs(df['parallax_error'] / df['parallax']) < 0.10) &
        (df['phot_g_mean_flux_over_error'] > 10) &
        (df['phot_bp_mean_flux_over_error'] > 10) &
        (df['phot_rp_mean_flux_over_error'] > 10) &
        (df['ruwe'] < 1.4)
    ]

    feature_columns = ['pmra', 'pmdec', 'parallax']
    features = df[feature_columns].dropna()

    lower_bound_pmra = np.percentile(df['pmra'], 1)
    upper_bound_pmra = np.percentile(df['pmra'], 99)
    lower_bound_pmdec = np.percentile(df['pmdec'], 1)
    upper_bound_pmdec = np.percentile(df['pmdec'], 99)

    df = df[
        (df['pmra'] > lower_bound_pmra) &
        (df['pmra'] < upper_bound_pmra) &
        (df['pmdec'] > lower_bound_pmdec) &
        (df['pmdec'] < upper_bound_pmdec)
    ]

    features = df[feature_columns].dropna()
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)

    return df, scaled_features

def custom_data_preprocessing(df: pd.DataFrame, user_filter: str):
    ops = {
        "<": operator.lt,
        "<=": operator.le,
        ">": operator.gt,
        ">=": operator.ge,
        "==": operator.eq,
        "!=": operator.ne
    }

    tokens = user_filter.split()
    if len(tokens) != 3:
        raise ValueError("Filter must be in the form: 'field operator value'")

    field, op_symbol, value_str = tokens

    if field not in GAIA_DR3_CONSTRAINTS:
        raise ValueError(f"'{field}' is not a valid Gaia DR3 field.")

    constraint = GAIA_DR3_CONSTRAINTS[field]

    if op_symbol not in ops:
        raise ValueError(f"'{op_symbol}' is not a valid comparison operator.")

    expected_type = constraint["type"]
    try:
        value = expected_type(value_str)
    except:
        raise ValueError(f"Value '{value_str}' must be of type {expected_type.__name__}.")

    if "min" in constraint and value < constraint["min"]:
        raise ValueError(f"Value for '{field}' must be >= {constraint['min']}.")
    if "max" in constraint and value > constraint["max"]:
        raise ValueError(f"Value for '{field}' must be <= {constraint['max']}.")

    op_func = ops[op_symbol]
    return df[op_func(df[field], value)]

def apply_custom_filters(csv_path: str, filters: Optional[str]):
    df = pd.read_csv(csv_path)

    if filters and filters.strip():
        df = custom_data_preprocessing(df, filters)
    else:
        df, _ = default_preprocessing(df)

    out_path = new_data_path(".csv")
    df.to_csv(out_path, index=False)
    return out_path
