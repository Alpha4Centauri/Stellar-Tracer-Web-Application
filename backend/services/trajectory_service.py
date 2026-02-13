import pandas as pd
import matplotlib.pyplot as plt
from amuse.community.bhtree.interface import BHTree
from amuse.lab import *
from amuse.couple import bridge
from amuse.datamodel import Particles
from galpy.potential import to_amuse, MWPotential2014
from astropy.coordinates import SkyCoord
from astropy import units as astro_units
from backend.utils.paths import new_plot_path

def simulate_trajectory(csv_path: str, period: float, dt: float, dtout: float, star_index: int):
    gaia_data = pd.read_csv(csv_path)

    if star_index < 0 or star_index >= len(gaia_data):
        raise IndexError("Star index out of range")

    ra = gaia_data["ra"].values * astro_units.deg
    dec = gaia_data["dec"].values * astro_units.deg
    parallax = gaia_data["parallax"].values
    pmra = gaia_data["pmra"].values * astro_units.mas / astro_units.yr
    pmdec = gaia_data["pmdec"].values * astro_units.mas / astro_units.yr
    rv = gaia_data["radial_velocity"].values * astro_units.km / astro_units.s
    masses = gaia_data["estimated_mass"].values

    distances = (1000.0 / parallax) * astro_units.parsec
    distances = distances.to(astro_units.kpc)

    coords = SkyCoord(ra=ra, dec=dec, distance=distances,
                      pm_ra_cosdec=pmra, pm_dec=pmdec, radial_velocity=rv)

    x = coords.cartesian.x.value
    y = coords.cartesian.y.value
    z = coords.cartesian.z.value

    vx = coords.velocity.d_x.value
    vy = coords.velocity.d_y.value
    vz = coords.velocity.d_z.value

    if period < 0:
        vx = -vx
        vy = -vy
        vz = -vz

    mwp_amuse = to_amuse(MWPotential2014, reverse=True)

    tend = abs(period) | units.Myr
    dt_unit = dt | units.Myr

    def setup_cluster(N, x, y, z, vx, vy, vz, mass):
        stars = Particles(N)
        stars.mass = mass | units.MSun
        stars.x = x | units.kpc
        stars.y = y | units.kpc
        stars.z = z | units.kpc
        stars.vx = vx | units.km/units.s
        stars.vy = vy | units.km/units.s