# Setup Virtual Environment

1. **Create a virtual environment**:

   ```sh
   python -m venv my_venv
   ```

2. **Activate the virtual environment**:
   ```sh
   .\my_venv\Scripts\activate.bat
   ```

## Install Required Libraries In venv

Once the virtual environment is activated, install the necessary libraries using pip:

```sh
pip install transformers joblib  torch underthesea pandas
```

## Config Model in Python

In file `src/python/test_phoBERT.py` copy the absolute path of file `svm_model.joblib` and set it like this:

```
loaded_model = joblib.load("D:\Capstone 2 - nhom 22\khuong\Capstone_2\BE_node\src\python\svm_model.joblib")
```
