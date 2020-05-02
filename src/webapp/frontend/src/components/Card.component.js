import React from "react";
import "../css/Card.css";
import "../css/owfont-master/css/owfont-regular.css";
var moment = require("moment");

class Card extends React.Component {
	// Props: day, key(index)

	render() {
		let newDate = new Date();
		const weekday = this.props.day.dt * 1000;
		newDate.setTime(weekday);

		const imgURL =
			"owf owf-" + this.props.day.weather[0].id + " owf-5x red";

		return (
			<div className="col-auto">
				<div className="daycard bg-light" align="center">
					<h3 className="card-title">
						{moment(newDate).format("dddd")}
					</h3>
					<p className="text-muted">
						{moment(newDate).format("MMMM Do, h:mm a")}
					</p>
					<i className={imgURL}></i>
					<h2>{Math.round(this.props.day.main.temp)} °F</h2>
					<div className="card-body">
						<p className="card-text">
							{this.props.day.weather[0].description}
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Card;
