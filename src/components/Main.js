//require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//get all the image data
let imageDatas = require('../data/image.json');

//convert image name into image url
function getImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
}

imageDatas = getImageURL(imageDatas);


var ImgFigure = React.createClass({
	render:function(){
		return(
			<figure className="img-figure">
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
		
	}
});

class AppComponent extends React.Component {
  render(){
  
    var controllerUnits = [],
	    imgFigures = [];
  
	imageDatas.forEach(function(value){
		imgFigures.push(<ImgFigure data={value} />);
	});
	
    return (
      <section className="stage">
        <section className="img-src">
			{imgFigures}
		</section>
		<nav className="controller-nav">
			{controllerUnits}
		</nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
