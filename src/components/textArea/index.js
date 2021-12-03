import React, { useState } from 'react';
import { ArrowIcon, MicrophoneIcon, TimeIcon } from '../../constants/icons';
import './style.scss';

const TextArea = props => {
	const [history, setHistory] = useState(false);

	const setHistoryText = item => {
		props.setTrText(item.trText);
		props.setEnText(item.enText, 'history');
		setHistory(false);
	}

	return (
		<div className="textAreaContainer">
			<div className="column">
				<div className="header">
					<span>ENGLISH</span>
					{
						props.history.length > 0 &&
						<>
							<div className={history ? 'icon turn' : 'icon'} onClick={() => setHistory(x => !x)}><ArrowIcon size="21"/></div>
							{
								history &&
								<ul>
									{
										props.history.map((item, index) => 
											<li key={index} onClick={() => setHistoryText(item)}>{item.enText}</li>
										)
									}
								</ul>
							}
						</>
					}
				</div>
				<label className="textArea">
					<textarea
						value={props.enText}
						onChange={e => props.setEnText(e.target.value, 'translate')}
						className="input"
						placeholder="Please enter  words or sentences"/>
						{
							props.enText &&
							<div className="close" onClick={props.close}><TimeIcon size="21"/></div>
						}
					<div className={props.isListening ? "microphone active" : "microphone"} onClick={() => props.setListening(x => !x)}><MicrophoneIcon size="21" /></div>
				</label>
			</div>
			<div className="column">
			<div className="header">
					<span>TURKISH</span>
				</div>
				<div className="textArea">
					<div className="input" dangerouslySetInnerHTML={{ __html: props?.trText && props.enText ? props?.trText  : 'Translate' }} />
				</div>
			</div>
		</div>
	);
}

export default TextArea;
