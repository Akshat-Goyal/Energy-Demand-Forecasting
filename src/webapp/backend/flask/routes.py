from flask import jsonify
from __init__ import app, model
import pandas as pd

@app.route("/predict", methods = ['GET'])
def predict():
	# data = [[request.form['date'] + " " + request.form['time']]]
	data = [["2020-03-23" + " " + "12:00:00"]]
	data = pd.DataFrame(data, columns=['ds'])
	val = model.predict(data)
	return val.to_dict()
