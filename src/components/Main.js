//require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//import {findDOMNode} from 'react-dom';
//var ReactDOM = require('react-dom');
import {findDOMNode} from 'react-dom';

//get all the image data
let imageDatas = require('../data/image.json');

//convert image name into image url
function getImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
		//require('../XXX'+fileNmae) can get the image url
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
}

//convert all the image name into image url
imageDatas = getImageURL(imageDatas);


//get the random value in a given range
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * Get 0-30 degree(neg & pos)
 */
function get30DegRandom(){
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
	
}


var ImgFigure = React.createClass({
	/*
     * handle the click imgFigure event
     */
    handleClick: function (e) {
	  
      if (this.props.arrange.isCenter) {
        this.props.inverse();
      } else {
        this.props.center();
      }

      e.stopPropagation();
      e.preventDefault();
    },

	render:function(){
		var styleObj = {};

        //If there is position value in props for this image
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }
		
		//If image contains rotate degree which is not 0, the degree will be added
		if (this.props.arrange.rotate) {
          (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
            styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
          }.bind(this));
        }
		
		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		
		var imgFigureClassName = 'img-figure';
		var imgFigureClassName = 'img-figure';
		    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
        
		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
                      <p>
                        {this.props.data.desc}
                      </p>
                    </div>
				</figcaption>
			</figure>
		)
		
	}
});

var AppComponent = React.createClass( {
  Constant:{
	centerPos:{
	  left:0,
	  right:0
	},
	//horizontal range
	hPosRange:{
	  leftSecX: [0,0],
	  rightSecX: [0,0],
	  y: [0,0]
	},
	//vertical range
	vPosRange:{
	  x: [0,0],
	  topY: [0,0]
	}
  },
  
  /*
   * Inverse image
   * @para index: current inverse image index
   * @return {Function} 闭包函数，a real function which wait to be excuted
   */
  inverse: function (index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },
  
  /*
   * rearrange all the images
   * @param centerIndex: point out which image is in center
   */
  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
		
		imgsArrangeTopArr = [],
		
        topImgNum = Math.floor(Math.random() * 2),    /* 0-1 */
		
        topImgSpliceIndex = 0,  /*the splice index for the image array which is shown at top*/
		
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
		
		//align the centerIndex image, no rotate */
        imgsArrangeCenterArr[0] = {
			pos:centerPos,
			rotate: 0,
			isCenter: true
		};
		
		
		
		/* get the image status in the top section */
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
		
		/* arrange images at the TOP section */
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index]= {
              pos:{
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
			  rotate: get30DegRandom(),
			  isCenter: false
            };
        });
		
		/* images in LEFT & RIGHT sections */
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            /* 前半部分布局左边， 右半部分布局右边 */
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i]={
			  pos:{
                top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
			  },
			  rotate: get30DegRandom(),
			  isCenter: false
            };
			
        }
		
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
  },
  
  /*
   * Center the image by using arrange function
   * @param index, the index of the image which is waiting to be centred
   * @returns {Function}
   */
  center: function (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  },

  getInitialState: function () {
    return {
        imgsArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,    // 旋转角度
                isInverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            }*/
        ]
    };
  },
  
  getInitialState:function(){
	return{
	  imgsArrangeArr:[
		{
			/*
			pos:{
				left:'0',
				top:'0'
			},
			rotate: 0,
			isInverse: false,
			isCenter: false
			*/
		}
	  ]
	};
  },
  
  /* calculate each image's positions range */
  componentDidMount:function(){
  
    /* get stage size */
    var stageDOM = findDOMNode(this.refs.stage),
	    stageW = stageDOM.scrollWidth,
		stageH = stageDOM.scrollHeight,
		halfStageW = Math.ceil(stageW/2),
		halfStageH = Math.ceil(stageH/2);
	
	/* get imageFigure size */
    var imgFigureDOM = findDOMNode(this.refs.imgFigure0),
	    imgW = imgFigureDOM.scrollWidth,
		imgH = imgFigureDOM.scrollHeight,
		halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
	
    /* calculate centre-image position	*/
	this.Constant.centerPos={
		left:halfStageW - halfImgW,
		top: halfStageH - halfImgH
	};
	
	/* calculate the image range in the left section & right section*/
	this.Constant.hPosRange.leftSecX[0] = -halfImgW;
	this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
	this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
	
	/* calculate the image range in the top section */
	this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
	
	this.rearrange(0);
  },

  render(){
  
    var controllerUnits = [],
	    imgFigures = [];
  
	imageDatas.forEach(function(value,index){
		
		if (!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
			    pos:{
					top: 0,
					left: 0
				},
				rotate:0,
				isInverse: false,
				isCenter: false
            };
        }
     
		imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
	}.bind(this));
	
    return (
      <section className="stage" ref="stage">
        <section className="img-src">
			{imgFigures}
		</section>
		<nav className="controller-nav">
			{controllerUnits}
		</nav>
      </section>
    );
  }
})


AppComponent.defaultProps = {
};

export default AppComponent;
