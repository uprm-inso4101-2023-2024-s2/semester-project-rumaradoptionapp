File Structure:

backend
    |
    |
    - __init__.py
    - app.py
    -src
        |
        |
        -config (Responsible of storing database information)
        -controller (Manages the data received from the database)
        -dao (pattern that provides an abstract interface to the database)


Instructions for Development:

- Make sure that the latest version of Python is installed in your computer.
- In VScode, install the Python Extension. It should include Pylance and Python Debugger.
- Create a Python Virtual Environment, press Ctrl+Shift+P and search for the option: Python: Create Environment
    - Create a .env environment.
    - When asked about which Python version to select, choose the latest version 3.12.1.
    - When asked if you wish to install requirements.txt. Select the option and let it install. This will install every      library necessary for the project.
    - Check in VsCode terminal or in the interpreter section, that you are using the .venv and not the global interpreter.

- If you install a new library that it is necessary for the project, please run "pip freeze > requirements.txt", this will update the file.
    - If you don't have all of the libraries in requirements.txt run "pip install -r requirements.txt" command.