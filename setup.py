# Copyright (c) 2007 gocept gmbh & co. kg
# See also LICENSE.txt

import os.path

from setuptools import setup, find_packages


setup(
    name = 'gocept.mochikit',
    version = "1.4.2.2",
    author = "Christian Zagrodnick",
    author_email = "cz@gocept.com",
    description = "MochiKit integration into Zope 3",
    long_description = file(os.path.join(os.path.dirname(__file__),
                                         'README.txt')).read(),
    license = "ZPL 2.1",
    url='http://pypi.python.org/pypi/gocept.mochikit',

    packages = find_packages('src'),
    package_dir = {'': 'src'},

    include_package_data = True,
    zip_safe = False,

    namespace_packages = ['gocept'],
    install_requires = [
        'setuptools',
        'zope.viewlet',
        'zc.resourcelibrary',
    ],
    extras_require = {
        'test': ['zope.testing',
                 'zope.testbrowser',
                 'zope.app.testing',
                 'zope.app.zcmlfiles',
                ],
    },
    )
