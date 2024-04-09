import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

//This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const statusConst = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}
class App extends Component {
  state = {activeCat : categoriesList[0].id, apiStatus: statusConst.initial, projectList: []}
  
  componentDidMount() {
    this.getList()
  }

  getList = async () => {
    this.setState({apiStatus: statusConst.loading})
    const {activeCat} = this.state
    const response = await fetch(`https://apis.ccbp.in/ps/projects?category=${activeCat}`)
    if(response.ok) {
      const data = await response.json()
      this.setState({projectList: data.projects,apiStatus: statusConst.success})
    }else{
      this.setState({apiStatus:statusConst.failure})
    }
  }
renderListItem = () => {
  const {projectList} = this.state
    return (<ul>
      {projectList.map(each => (
        <li key={each.id}>
          <img src={each.image_url} alt={each.name} />
          <p>{each.name}</p>
        </li>
      ))}
    </ul>
    )
}

onretry = () => {
  this.getList()
}
  renderLoading = () => (
    <div data-testid="loader"><Loader></Loader></div>
  )
  renderFai = () => (
    <>
      <img src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png" alt="failure view" />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.onretry}>Retry</button>
    </>
  )
  renderList = () => {
    const {apiStatus} = this.state
    switch(apiStatus) {
      case statusConst.loading: return this.renderLoading()
      case statusConst.failure: return this.renderFai()
      case statusConst.success: return this.renderListItem()
      default: return null 
    }
  }
  onSelect = event => {
    const filtered = categoriesList.filter(each => each.displayText === event.target.value)
    this.setState({activeCat: filtered[0].id},this.getList)
  }
  render() {
    const {activeCat} = this.state
    return (
      <div>
        <nav>
          <img src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png" alt="website logo" />
        </nav>
        <select value={activeCat} onChange={this.onSelect}>
          {
            categoriesList.map(each=> (
              <option  value={each.id} key={each.id}>
               {each.displayText}
              </option>
            ))
          }
        </select>
       {this.renderList()}
      </div>
    )
  }
}

export default App
