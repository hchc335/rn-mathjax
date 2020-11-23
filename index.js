import React, { Component }  from 'react';
import { View,Text } from 'react-native';
import { WebView } from 'react-native-webview';

const defaultOptions = {
	messageStyle: 'none',
	extensions: ['tex2jax.js'],
	jax: ['input/TeX', 'output/HTML-CSS'],
	tex2jax: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		displayMath: [['$$', '$$'], ['\\[', '\\]']],
		processEscapes: true,
	},
	TeX: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
		extensions: ['AMSmath.js', 'AMSsymbols.js', 'noErrors.js', 'noUndefined.js']
	}
};

class MathJax extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 5
		};
	}

	handleMessage(message) { 
		this.setState({
			height: Number(message.nativeEvent.data) 
		});
	}

	wrapMathjax(content) {
		const options = JSON.stringify(
			Object.assign({}, defaultOptions, this.props.mathJaxOptions)
		);
 			return `
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
			<script type="text/x-mathjax-config">
				MathJax.Hub.Config(${options});

				MathJax.Hub.Queue(function() {
					var height = document.documentElement.scrollHeight; 
					window.ReactNativeWebView.postMessage(String(height));
					window.postMessage(String(height));
					document.getElementById("formula").style.visibility = '';
				});
				 setTimeout(function() { 
					    
  
					window.postMessage(Math.min(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)); 
				}, 500);
				true; // note: this is required, or you'll sometimes get silent failures
			</script>
    		<script src="http://gamliteit.dyndns.biz:776/tex-chtml.js"></script>
			<div id="formula" style="visibility: hidden;">
		 		${content}
		 	</div>
		`; 
	}
	render() {
		const html = this.wrapMathjax(this.props.html); 
		 const props = Object.assign({}, this.props, { html: undefined });
	 
		return (
			<View style={{ height: this.state.height}}> 
				<WebView
    				automaticallyAdjustContentInsets={false}
					scrollEnabled={false} 
					injectedJavaScript="window.postMessage(document.body.scrollHeight+'','*')" // ios
					onMessage={this.handleMessage.bind(this)}
					originWhitelist={['*']}
					javaScriptEnabled={true}
				source={{ html: html }}
				{...props} 
			/>
			</View>
		); 
	}
}

export default MathJax;
