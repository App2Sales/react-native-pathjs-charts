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

'use strict'

import React, { Component } from 'react';
import { View, Text, Navigator } from 'react-native';

import { Radar } from 'react-native-pathjs-charts'

class RadarChartBasic extends Component {
  render() {
    let data = [{
      "speed": 10,
      "balance": 6,
      "explosives": 10,
      "energy": 7,
      "flexibility": 4,
      "Teste": 2,
      "Teste 2": 4,
      "Outro": 7,
      "Outro2": 4,
    }]

    let options = {
      width: 300,
      height: 300,
      r: 100,
      max: 10,
      fill: "#FFDC03",
      stroke: "#666666",
      animate: {
        type: 'oneByOne',
        duration: 200
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: false,
        fill: '#34495E'
      }
    }
    
    return (
      <View style={{flex: 1,backgroundColor: '#383838'}}>
        <Radar  backgroundColor={"#383838"} divs={10} data={data} options={options} />
        
      </View>
    )
  }
}

export default RadarChartBasic;
