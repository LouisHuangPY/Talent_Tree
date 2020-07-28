import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { withRouter } from "react-router-dom"
import FirebaseMg from '../Utils/FirebaseMg.js'
import './PostingPage.css';

function _uuid() {
  var d = Date.now();
  if ( typeof performance !== 'undefined' && typeof performance.now === 'function' ){
  	d += performance.now(); 
  	//use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  	var r = (d + Math.random() * 16) % 16 | 0 ;
    d = Math.floor(d / 16) ;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) ;
  });
}

class PostingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			subjects: [
				{
					children: [],
					name: ""
				}
			], 
			fields: [
				{
					children: [],
					name: "--請選擇科系--"
				}
			],
			skills: [
				{
					children: [],
					name: "--請選擇領域--"
				}
			],
			subskills: [
				{
					children: [],
					name: "--請選擇技能--"
				}
			],
			standards: [
				{
					name: ""
				}
			],
			showStandards: false,
			showHelp: false,
			defaultData: this.props.location.state
		} ;
		this.chooseSubject = this.chooseSubject.bind(this) ;
		this.chooseField = this.chooseField.bind(this) ;
		this.chooseSkill = this.chooseSkill.bind(this) ;
		this.chooseSubskill = this.chooseSubskill.bind(this) ;
		this.handleSubmit = this.handleSubmit.bind(this) ;
		this.chooseStandard = this.chooseStandard.bind(this) ;
	}
	
	componentDidMount() {
		const defaultData = this.state.defaultData
		if ( !defaultData ) {
			const fbMg = new FirebaseMg() ;
			var root = fbMg.myRef ;
			var path = 'Trees' ;
			var myRef = root.child(path) ;
			myRef.once('value').then( (snapshot) => {
				let data = snapshot.val() ;
				// let fields = [] ;
				// let skills = [] ;
				// let subSkills = [] ;

				// data.forEach(function(index, subject) {

				// 	return subject;
				// })

				// data["資管系"]["children"].forEach( (field) => {
				// 	fields.push( field.name ) ;
				// 	console.log(field);
				// 	field["children"].forEach( (skill) => {
				// 		skills.push( skill.name ) ;
				// 		skill["children"].forEach( (subSkill) => {
				// 			console.log(subSkill);
				// 			subSkills.push( subSkill.name ) ;
				// 		} ) ;
				// 	} ) ;
				// } ) ;

				// let level_2 = data["資管系"].children
				// for (var index_2 in level_2) {
				// 	fields.push( level_2[index_2]["name"] ) ;
				// 	let level_3 = level_2[index_2]["children"]
				// 	for (var index_3 in level_3) {
				// 		skills.push( level_3[index_3]["name"] ) ;
				// 		let level_4 = level_3[index_3]["children"]
				// 		for (var index_4 in level_4) {
				// 			subSkills.push( level_4[index_4]["name"] ) ;
				// 		}
				// 	}
				// }
				
				let subjects = [
					{
						children: [],
						name: "--請選擇--"
					}
				] ;
				for ( var i in data ) {
					subjects.push( data[i] )
				}
				
				this.setState( { 
					data: data,
					subjects: subjects
				} )
				
			} )
			.catch( (error) => {
				console.log(error) ;
			} ) ;
		}
		
	}

	chooseSubject(e) {
		
		let data = this.state.data
		let fields ;

		if ( !(this.state.fields[0].name === "--請選擇科系--") ) {
			fields = data[e.target.value]["children"]
		}
		else {
			fields = [
				{
					children: [],
					name: "--請選擇--"
				}
			]

			fields = fields.concat( data[e.target.value]["children"] )
		}
		
		this.setState( {
			fields: fields
		} )

		const subjects = this.state.subjects
		if ( subjects[0].name === "--請選擇--" ) {
			let newSubjects = subjects.filter( (subject) =>
				  subject.name !== "--請選擇--"
			)
			this.setState( {
				subjects: newSubjects
			} )
		}
	}
	chooseField(e) {
		
		let fields = this.state.fields
		let initialSkills ;
		let field = fields.find( (node) => {
			return node.name === e.target.value
		} )
		const skills = field.children

		if ( !(this.state.skills[0].name === "--請選擇領域--") ) {
			this.setState( {
				skills: skills
			} )
		}
		else {
			initialSkills = [
				{
					children: [],
					name: "--請選擇--"
				}
			]

			initialSkills = initialSkills.concat( skills )
			this.setState( {
				skills: initialSkills
			} )
		}
		
		if ( fields[0].name === "--請選擇--" ) {
			let newFields = fields.filter( (field) =>
				  field.name !== "--請選擇--"
			)
			this.setState( {
				fields: newFields
			} )
			e.target.selectedIndex -= 1
		}
	}
	chooseSkill(e) {
		
		let skills = this.state.skills
		let initialSubskills ;
		let skill = skills.find( (node) => {
			return node.name === e.target.value
		} )
		let subskills = skill.children

		if ( !(this.state.subskills[0].name === "--請選擇技能--") ) {
			this.setState( {
				subskills: subskills
			} )
		}
		else {
			initialSubskills = [
				{
					children: [],
					name: "--請選擇--"
				}
			]

			initialSubskills = initialSubskills.concat( subskills )
			console.log(initialSubskills);
			this.setState( {
				subskills: initialSubskills
			} )
		}

		if ( skills[0].name === "--請選擇--" ) {
			let newSkills = skills.filter( (skill) =>
				  skill.name !== "--請選擇--"
			)
			this.setState( {
				skills: newSkills
			} )
			e.target.selectedIndex -= 1
		}
	}
	chooseSubskill(e) {
		
		let subskills = this.state.subskills
		let subskill = subskills.find( (node) => {
			return node.name === e.target.value
		} )
		let standards = subskill.children
		this.setState( {
			standards: standards,
			showStandards: true
		} )

		if ( subskills[0].name === "--請選擇--" ) {
			let newSubskills = subskills.filter( (subskill) =>
				  subskill.name !== "--請選擇--"
			)
			this.setState( {
				subskills: newSubskills
			} )
			e.target.selectedIndex -= 1
		}
	}
	handleSubmit(e) {
		e.preventDefault() ;
		const elems = e.target.elements
		const standards = Array.from(elems.standard)
		if ( standards.some( (standardInput) => standardInput.checked ) ) {
			const standardsChecked = standards.filter( (standard) => 
				standard.checked
			)
			const standardVals = standardsChecked.map( (standard) => 
				standard.value
			)
			const fbMg = new FirebaseMg() ;
			var root = fbMg.myRef ;
			var path = 'Posts/'+ elems.subskill.value +"/"+ _uuid() ;
			var myRef = root.child(path) ;
			myRef.set( {
				user: "Louis",
				name: elems.postTitle.value,
				type: elems.courseType.value,
				course: {
					intro: elems.courseIntro.value,
					links: [
						{
							url: elems.courseURL.value
						}
					]
				},
				standards: standardVals,
				like: 0,
				dislike: 0,
				view: 0,
				timePosted: new Date().toLocaleString()
			} ).then( () => {
				// redirect
				this.props.history.push("/forum")
			} )
			.catch( (error) => {
				console.log(error) ;
			} ) ;
		}
		else {
			this.setState( {
				showHelp: true
			} )
		}
	}
	chooseStandard(e) {
		if ( e.target.checked ) {
			this.setState( {
				showHelp: false
			} )
		}
	}

	render( ) {
		const defaultData = this.state.defaultData
		const hasDefault = Boolean( defaultData )
		let subjectInput ;
		let fieldInput ;
		let skillInput ;
		let subskillInput ;
		let standardBoxes ;
		if ( hasDefault ) {
			subjectInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subject">
			        <Form.Label>科系名稱</Form.Label>
			        <Form.Control
			          name="subject" 
			          as="select"
			          disabled
			          required>
			          <option>{defaultData.subject}</option>
			          <option>資管系</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			fieldInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="field">
			        <Form.Label>領域名稱</Form.Label>
			        <Form.Control
			          name="field" 
			          as="select" 
			          disabled
			          required>
			          <option>{defaultData.field}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			skillInput = 
				<Col md={{ span: 2, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="skill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="skill" 
			          as="select" 
			          disabled
			          required>
			          <option>{defaultData.skill}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			subskillInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subskill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="subskill" 
			          as="select" 
			          disabled
			          required>
			          <option>{defaultData.subskill}</option>
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			standardBoxes =
				<Col md={{ span: 4, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="standard">
			        <Form.Label>選擇學習標準（至少選一種）</Form.Label>
			        <div>
			        	{	
				        	defaultData.standards.map( (standard) =>
				        		<Form.Check 
					    		inline 
					    		label={ standard } 
					    		type={'checkbox'} 
					    		onClick={ this.chooseStandard }
					    		value={ standard }
					    		name="standard"
					    		aria-describedby="checkboxHelp" />
				        	)
				        }
			        </div>
			        {
			        	this.state.showHelp ? 
			        	<Form.Text id="checkboxHelp" className="post help" >
						  請您為這堂課程選擇至少一個學習標準。
						</Form.Text> : ""
			        }
			      </Form.Group>
			  	</Col>
		}
		else {
			subjectInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subject">
			        <Form.Label>科系名稱</Form.Label>
			        <Form.Control
			          name="subject" 
			          as="select" 
			          onChange={this.chooseSubject}
			          required>
			          {
			          	this.state.subjects.map( (subject) => 
							<option>{subject.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
						  	
			fieldInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="field">
			        <Form.Label>領域名稱</Form.Label>
			        <Form.Control
			          name="field" 
			          as="select" 
			          onChange={this.chooseField}
			          required>
			          {
			          	this.state.fields.map( (field) => 
							<option>{field.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			skillInput = 
				<Col md={{ span: 2, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="skill">
			        <Form.Label>技能名稱</Form.Label>
			        <Form.Control
			          name="skill" 
			          as="select" 
			          onChange={this.chooseSkill}
			          required>
			          {
			          	this.state.skills.map( (skill) => 
							<option>{skill.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			subskillInput = 
				<Col md={2} sm={6} xs={12}>
			  	  <Form.Group controlId="subskill">
			        <Form.Label>子技能名稱</Form.Label>
			        <Form.Control
			          name="subskill" 
			          as="select"
			          onChange={this.chooseSubskill}
			          required>
			          {
			          	this.state.subskills.map( (subskill) => 
							<option>{subskill.name}</option>
			          	)
			          }
			        </Form.Control>
			      </Form.Group>
			  	</Col>
			if ( this.state.showStandards ) {
				standardBoxes =
		  		<Col md={{ span: 4, offset: 7 }} sm={6} xs={12}>
			  	  <Form.Group controlId="standard">
			        <Form.Label>選擇學習標準（至少選一種）</Form.Label>
			        <div>
			        	{	
				        	this.state.standards.map( (standard) =>
				        		<Form.Check 
					    		inline 
					    		label={ standard.name } 
					    		type={'checkbox'} 
					    		onClick={ this.chooseStandard }
					    		value={ standard.name }
					    		name="standard"
					    		aria-describedby="checkboxHelp" />
				        	)
				        }
			        </div>
			        {
			        	this.state.showHelp ? 
			        	<Form.Text id="checkboxHelp" className="post help" >
						  請您為這堂課程選擇至少一個學習標準。
						</Form.Text> : ""
			        }
			      </Form.Group>
			  	</Col>
			}
		}

		return (
			<div className="content" style={{ 'marginTop': '12vh' }}>
				<div className="container form-container">
					<Form onSubmit={this.handleSubmit}>
					  <Form.Row>
					  	<Col md={{ span: 6, offset: 1 }} xs ={12}>
					  	  <Form.Group controlId="postTitle">
					        <Form.Label>標題</Form.Label>
					        <Form.Control
					          name="postTitle" 
					          type="text" 
					          placeholder="請輸入標題" 
					          required />
					      </Form.Group>
					  	</Col>
					  	{ subjectInput }
					  	{ fieldInput }
					  </Form.Row>

					  <Form.Row>
					    { skillInput }
					  	{ subskillInput }
					  </Form.Row>

					  <Form.Row>
					  	{ standardBoxes }
					  </Form.Row>
						
					  <Form.Row>
					  	<Col md={{ span: 8, offset: 1 }}>
					  	  <Form.Group controlId="courseURL">
					        <Form.Label>課程網址</Form.Label>
					        <Form.Control
					          name="courseURL" placeholder="請輸入網址" required />
					      </Form.Group>
					  	</Col>
					  	<Col md={2}>
					  	  <Form.Group controlId="courseType">
					        <Form.Label>課程分類</Form.Label>
					        <Form.Control
					          name="courseType" as="select" required>
					          <option>平台課程</option>
					          <option>心得筆記</option>
					          <option>音訊影片</option>
					        </Form.Control>
					       </Form.Group>
					  	</Col>
					  </Form.Row>

					  <Form.Row>
					    <Col md={{ span: 10, offset: 1 }}>
					      <Form.Group controlId="courseIntro">
					        <Form.Label>課程簡介</Form.Label>
					        <Form.Control
					          name="courseIntro" as="textarea" rows="6" placeholder="請輸入簡介，限200字內。" required />
					      </Form.Group>
					    </Col>
					  </Form.Row>

					  <div className="container">
					  	<div className="row justify-content-end">
					  	  <div className="col-md-4 button-col post">
					  	  	<Button id="post-btn" className="primary" type="submit">
						  	  	發布文章
							</Button>
					  		
					  	  </div>
					  	  <div className="col-md-1">
					  	  </div>
					    </div>
					  </div>
					  
					</Form>
				</div>
			</div>
		);
	}
}

export default withRouter(PostingPage) ;