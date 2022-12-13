import { request, gql } from 'graphql-request';
import { getAccessToken } from '../auth';

const GRAPHQL_URL = `http://localhost:9000/graphql`;
const HEADERS = { Authorization: `Bearer ${getAccessToken()}` };

async function getJobs() {
    const query = gql`
        query {
            jobs {
                id
                title
                description
                company {
                    name
                }
            }
        }
    `;
    const { jobs } = await request(GRAPHQL_URL, query);
    return jobs;
}

async function getJob(jobId) {
    const query = gql`
        query JobQuery($id: ID!) {
            job(id: $id) {
                id
                title
                description
                company {
                    id
                    name
                }
            }
        }
    `;
    const variables = { id: jobId };
    const { job } = await request(GRAPHQL_URL, query, variables);
    return job;
}

async function getCompany(companyId) {
    const query = gql`
        query CompanyQuery($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;
    const variables = { id: companyId };
    const { company } = await request(GRAPHQL_URL, query, variables);
    return company;
}

async function createJob(input) {
    const query = gql`
        mutation CreateJobMutation($input: CreateJobInputType!) {
            job: createJob(input: $input) {
                id
                title
                company {
                    id
                    name
                }
            }
        }
    `;

    const variables = { input: input };
    const { errors, job } = await request(GRAPHQL_URL, query, variables, HEADERS);
    return { errors, job };
}

export { getJobs, getJob, getCompany, createJob };
