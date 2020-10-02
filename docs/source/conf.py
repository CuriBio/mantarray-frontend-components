# -*- coding: utf-8 -*-
# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

import inspect
import os
from typing import List

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# sys.path.insert(0, os.path.abspath('.'))
abs_repo_root_path = os.path.abspath(
    os.path.join(os.path.dirname((inspect.stack()[0][1])), os.pardir, os.pardir)
)
path_to_jsdoc = os.path.abspath(
    os.path.join(abs_repo_root_path, "node_modules", ".bin", "jsdoc")
)
path_to_jsdoc = os.path.abspath(
    os.path.join(os.pardir, os.pardir, "node_modules", ".bin")
)


os.environ["PATH"] += (
    os.pathsep + path_to_jsdoc
)  # add the local JSDOC installation to the system PATH so that sphinx can find it even when it's not installed globally


js_source_path = os.path.join(abs_repo_root_path, "src")


# -- Project information -----------------------------------------------------

project = "frontend_test_utils"
copyright = "2019, NanoSurface Biomedical"  # pylint: disable=redefined-builtin
author = "NanoSurface Biomedical"

# The full version, including alpha/beta/rc tags
release = "0.1"


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.


extensions: List[str] = ["sphinx.ext.napoleon", "sphinx_js"]

# Add any paths that contain templates here, relative to this directory.
templates_path: List[str] = []

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns: List[str] = []


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "alabaster"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path: List[str] = []
