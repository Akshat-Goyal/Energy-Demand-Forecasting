from flask import Flask
import pickle

with open('./model.pkl', 'rb') as f:
	model = pickle.load(f)
	app = Flask(__name__)
	from routes import *
	if __name__ == '__main__':
		app.run(debug=True)

