/*
Copyright 2016 Capital One Services, LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

SPDX-Copyright: Copyright (c) Capital One Services, LLC
SPDX-License-Identifier: Apache-2.0
*/

import React, {Component} from 'react'
import {Text as ReactText}  from 'react-native'
import Svg,{Circle, G, Path, Line, Text} from 'react-native-svg'
import { Options, identity, styleSvg, fontAdapt } from './util'
const Radar = require('paths-js/radar')
import 'babel-polyfill'

function accessKeys(keys) {
  let a = {}
  for (let i in keys) {
    let key = keys[i]
    a[key] = identity(key)
  }
  return a
}

export default class RadarChart extends Component
{

  static defaultProps = {
    options: {
      width: 600,
      height: 600,
      margin: {top: 20, left: 20, right: 20, bottom: 20},
      r: 300,
      max: 150,
      fill: '#2980B9',
      stroke: '#2980B9',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition:3
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 14,
        bold: true,
        color: '#34495E'
      }
    }
  }

  render() {
    const noDataMsg = this.props.noDataMessage || 'No data available'
    if (this.props.data === undefined) return (<ReactText>{noDataMsg}</ReactText>)

    const options = new Options(this.props)

    const x = options.chartWidth / 2
    const y = options.chartHeight / 2
    const radius = Math.min(x, y)

    const center = this.props.center || [x, y]

    const keys = Object.keys(this.props.data[0])
    const chart = Radar({
      center: this.props.center || [x, y],
      r: this.props.options.r || radius,
      data: this.props.data,
      accessor: this.props.accessor || accessKeys(keys),
      max: this.props.options.max
    })
    const self = this
    const colors = styleSvg({}, self.props.options)
    const colorsFill = self.props.options.fill
    const curves = chart.curves.map(function (c, i) {
      const color = colorsFill instanceof Array ? colorsFill[i] : colorsFill;
      return (<Path stroke={color} strokeWidth="2" key={i} d={c.polygon.path.print()} fill={color} fillOpacity={0.4} />)
    })

    const length = chart.rings.length

    function getValues(angle, radius){
        angle = angle*(Math.PI / 180);
        let x = Math.cos(angle)*radius;
        let y = Math.sin(angle)*radius;
        return {x: x, y: y}
    }
    
    function _renderCircles(radius, centerX, centerY, divs,circleLineColor, backgroundColor) {
        let circles = [
            <Circle
                key={"circle"+0}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={backgroundColor || 'transparent'}
                stroke={circleLineColor || "#666666"}
                strokeWidth="1"

            />
        ];
        let spaceBetween = radius/divs;
        let r = spaceBetween;
        for(var i = 0; i < divs; i++){
            circles.push(
                <Circle
                    key={"circle"+i+1}
                    cx={centerX}
                    cy={centerY}
                    r={r}
                    fill="transparent"
                    stroke={circleLineColor || "#444444"}
                    strokeOpacity={0.4}
                    strokeWidth="1"
                    strokeDasharray={[5,5]}
                />)
            r += spaceBetween;
        }
        
        return circles
    }

    const circles = _renderCircles(this.props.options.r || radius, x, y,this.props.divs, colors.stroke, this.props.data)

    function _renderLines(radius,centerX, centerY,circleLineColor, data) {
        let angle = 360/Object.keys(data[0]).length;
        let lines = []
        let angles = 90;
        var i = 0;
        for(var index in data[0]) { 
          let sum = getValues(angles, radius);
            lines.push(
               <Line
                    key={"line" + index}
                    x1={centerX}
                    y1={centerY}
                    x2={centerX - sum.x}
                    y2={centerY - sum.y}
                    stroke={circleLineColor}
                    strokeWidth="1"
                />)
            angles += angle; 
        }
        return lines;
    }

    const lines = _renderLines(this.props.options.r || radius, x, y,colors.stroke, this.props.data)

    const textStyle = fontAdapt(options.label)

    const labels = chart.rings[length - 1].path.points().map( (p, i) =>{
      let r = (this.props.options.r || radius) +(this.props.options.r || radius)*0.35;
      let angle = 360/Object.keys(this.props.data[0]).length;
      let sum = getValues(90+ angle*i, r);
      let data = this.props.data[0];
      return (
              <G key={'label' + i}>
                  <Text fontFamily={textStyle.fontFamily}
                    fontSize={textStyle.fontSize}
                    fontWeight={textStyle.fontWeight}
                    fontStyle={textStyle.fontStyle}
                    fill={'#fff'}
                    textAnchor="middle" x={Math.floor(center[0]-sum.x)} y={Math.floor(center[1]-sum.y)}>{keys[i].toUpperCase()}{data[keys[i]]}</Text>
              </G>
            )
    })

    function _renderDots(data, center, radius,colorsFill,max){

        let dots = [];
        let keys = Object.keys(data);
        const color = colorsFill instanceof Array ? colorsFill[0] : colorsFill;
        for(var i = 0; i < keys.length; i++){
            let angle = 360/keys.length;
            let sum = getValues(90+ angle*i, radius*(data[keys[i]]/max));
            dots.push(
                <Circle
                key={"dot"+i}
                cx={center[0]-sum.x}
                cy={center[1]-sum.y}
                r={3}
                fill={color || "transparent"}
                stroke={ color || "transparent"}
                strokeOpacity={0.4}
                strokeWidth="1"
                strokeDasharray={[5,5]}
            />)
        }

        return dots;
    }

    const dots = _renderDots(this.props.data[0],center, this.props.options.r || radius, this.props.options.fill, this.props.options.max);

    return (<Svg width={options.width} height={options.height}>
                <G x={options.margin.left} y={options.margin.top}>
                    {!this.props.withoutLabels?labels:null}
                    <G x={options.margin.left * -1} y={options.margin.top * -1}>
                        {lines}
                        {circles}
                        {curves}
                        {dots}
                    </G>
                </G>
            </Svg>)
  }
}