const neo4j = require('neo4j-driver');
require('dotenv').config();

const neo4jUri = process.env.NEO4J_URI;
const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(neo4jUri, neo4j.auth.basic(neo4jUser, neo4jPassword));

function formatNodeProperties(properties, label) {
    let info = `${label}: `;
    const keys = Object.keys(properties);
  
    keys.forEach(key => {
      if (Array.isArray(properties[key])) {
        info += `${key}: [${properties[key].join(', ')}], `;
      } else if (typeof properties[key] === 'object') {
        const subKeys = Object.keys(properties[key]);
        subKeys.forEach(subKey => {
          info += `${key}.${subKey}: ${properties[key][subKey]}, `;
        });
      } else {
        info += `${key}: ${properties[key]}, `;
      }
    });
     console.log(info.slice(0, -2));
    return info.slice(0, -2); 
  }

async function retrieveSummaryFromNeo4j() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (n)-[r]->(m)
      RETURN 
        labels(n) AS source_label, 
        n AS source_node, 
        type(r) AS relationship_type, 
        r AS relationship, 
        labels(m) AS target_label, 
        m AS target_node
    `);
    
    const summary = result.records.map(record => {
      const sourceLabel = record.get('source_label')[0];
      const targetLabel = record.get('target_label')[0];
      const relationshipType = record.get('relationship_type');
      const sourceProperties = record.get('source_node').properties;
      const targetProperties = record.get('target_node').properties;

      let sourceInfo = formatNodeProperties(sourceProperties, sourceLabel);
      let targetInfo = formatNodeProperties(targetProperties, targetLabel);

      return `${sourceInfo} has ${relationshipType} with ${targetInfo}`;
    });

    return summary;
  } finally {
    await session.close();
  }
}

module.exports = retrieveSummaryFromNeo4j;
