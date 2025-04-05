import React, { Component } from 'react';
import './index.css';

class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      loading: true,
      error: null,
      searchQuery: '',
      locationQuery: '',
    };
  }

  componentDidMount() {
    this.loadJobsFromLocalStorage();
  }

  loadJobsFromLocalStorage = () => {
    try {
      const storedJobs = JSON.parse(localStorage.getItem('jobs')) || [];
      this.setState({ jobs: storedJobs, loading: false });
    } catch (error) {
      this.setState({ error: 'Failed to load jobs from local storage', loading: false });
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleLocationChange = (e) => {
    this.setState({ locationQuery: e.target.value });
  };

  render() {
    const { jobs, loading, error, searchQuery, locationQuery } = this.state;

    const filteredJobs = jobs.filter(job => {
      const searchLower = searchQuery.toLowerCase().trim();
      const locationLower = locationQuery.toLowerCase().trim();

      const matchesSearch = 
        searchLower === '' || 
        job.title?.toLowerCase().includes(searchLower) || 
        job.company?.toLowerCase().includes(searchLower) || 
        job.description?.toLowerCase().includes(searchLower);

      const matchesLocation = 
        locationLower === '' || 
        job.location?.toLowerCase().includes(locationLower);

      return matchesSearch && matchesLocation;
    });

    if (loading) return <div className="loading">Loading jobs...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div className="all-jobs-container">
        <div className="job-filters">
          <input
            type="text"
            placeholder="Search title, company, or description"
            value={searchQuery}
            onChange={this.handleSearchChange}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search by location"
            value={locationQuery}
            onChange={this.handleLocationChange}
            className="location-input"
          />
        </div>

        <div className="job-cards-container">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div key={index} className="job-card">
                <div className="job-card-header">
                  <h3 className="job-title">{job.title}</h3>
                  <span className="company-name">{job.company}</span>
                </div>
                <div className="job-details">
                  <span className="job-location">
                    <i className="fas fa-map-marker-alt"></i> {job.location}
                  </span>
                  {job.salary && (
                    <span className="job-salary">
                      <i className="fas fa-money-bill-wave"></i> ₹{job.salary.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="job-description">
                  {job.description.length > 150
                    ? job.description.slice(0, 150) + '...'
                    : job.description}
                </div>
                <button className="apply-button">Apply Now</button>
                <button className="save-button">
                  <i className="far fa-bookmark"></i> Save
                </button>
              </div>
            ))
          ) : (
            <div className="no-jobs">No matching jobs found.</div>
          )}
        </div>
      </div>
    );
  }
}

export default Jobs;
