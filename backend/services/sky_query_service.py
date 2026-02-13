import pandas as pd
from astroquery.gaia import Gaia
from backend.utils.paths import new_data_path

def run_sky_query(adql_query: str) -> str:
    job = Gaia.launch_job_async(adql_query)
    results = job.get_results()
    df = results.to_pandas()

    path = new_data_path(".csv")
    df.to_csv(path, index=False)
    return path
