/* eslint-disable camelcase, no-bitwise, func-names, max-len */

const storage = window.sessionStorage;

function murmurhash3_32_gc(key, seed) {
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;
  let h1 = seed;
  let k1;
  let h1b;
  let i = 0;

  while (i < bytes) {
    // Use parentheses to clarify the order of operations and align operators as per the ESLint config
    k1 = (key.charCodeAt(i) & 0xff) 
        | ((key.charCodeAt(i + 1) & 0xff) << 8) 
        | ((key.charCodeAt(i + 2) & 0xff) << 16) 
        | ((key.charCodeAt(i + 3) & 0xff) << 24);
    i += 4; // Increment i by 4 as we are processing four bytes each loop iteration

    k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
    h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
  }

  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      break;
    case 2:
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      break;
    case 1:
      k1 ^= (key.charCodeAt(i) & 0xff);
      k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
      h1 ^= k1;
      break;
    default:
      break;
  }
  h1 ^= key.length;
  h1 ^= h1 >>> 16;
  h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= h1 >>> 13;
  h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}

const TOTAL_BUCKETS = 10000;

function getBucket(saltedId) {
  const hash = murmurhash3_32_gc(saltedId, 0);
  const hashFixedBucket = Math.abs(hash) % TOTAL_BUCKETS;
  const bucket = hashFixedBucket / TOTAL_BUCKETS;
  return bucket;
}

function pickWithWeightsBucket(allocationPercentages, treatments, bucket) {
  const sum = allocationPercentages.reduce((partialSum, a) => partialSum + a, 0);
  let partialSum = 0.0;
  for (let i = 0; i < treatments.length; i += 1) {
    partialSum += Number(allocationPercentages[i].toFixed(2)) / sum;
    if (bucket <= partialSum) {
      return treatments[i];
    }
  }
  return null; // Ensure function returns a value even if no condition is met
}

function assignTreatmentByVisitor(experimentId, identityId, allocationPercentages, treatments) {
  const saltedId = `${experimentId}.${identityId}`;
  const bucketId = getBucket(saltedId);
  const treatmentId = pickWithWeightsBucket(allocationPercentages, treatments, bucketId);
  return {
    treatmentId,
    bucketId,
  };
}

const LOCAL_STORAGE_KEY = 'unified-decisioning-experiments';

function assignTreatment(allocationPercentages, treatments) {
  let random = Math.random() * 100;
  let i = treatments.length;
  while (random > 0 && i > 0) {
    i -= 1;
    random -= allocationPercentages[i];
  }
  return treatments[Math.max(i, 0)]; // Ensure index is within bounds
}

function getLastExperimentTreatment(experimentId) {
  const experimentsStr = storage.getItem(LOCAL_STORAGE_KEY);
  if (experimentsStr) {
    const experiments = JSON.parse(experimentsStr);
    return experiments[experimentId] ? experiments[experimentId].treatment : null;
  }
  return null;
}

function setLastExperimentTreatment(experimentId, treatment) {
  const experimentsStr = storage.getItem(LOCAL_STORAGE_KEY);
  const experiments = experimentsStr ? JSON.parse(experimentsStr) : {};
  const now = new Date();
  Object.keys(experiments).forEach((key) => {
    const expirationTime = 1000 * 86400 * 30; // 30 days
    if ((now.getTime() - new Date(experiments[key].date).getTime()) > expirationTime) {
      delete experiments[key];
    }
  });
  const date = now.toISOString().split('T')[0];
  experiments[experimentId] = { treatment, date };
  storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(experiments));
}

function assignTreatmentByDevice(experimentId, allocationPercentages, treatments) {
  const cachedTreatmentId = getLastExperimentTreatment(experimentId);
  let treatmentIdResponse;
  if (!cachedTreatmentId || !treatments.includes(cachedTreatmentId)) {
    const assignedTreatmentId = assignTreatment(allocationPercentages, treatments);
    setLastExperimentTreatment(experimentId, assignedTreatmentId);
    treatmentIdResponse = assignedTreatmentId;
  } else {
    treatmentIdResponse = cachedTreatmentId;
  }
  return {
    treatmentId: treatmentIdResponse,
  };
}

const RandomizationUnit = {
  VISITOR: 'VISITOR',
  DEVICE: 'DEVICE',
};

function evaluateExperiment(context, experiment) {
  const { id: experimentId, identityNamespace, randomizationUnit = RandomizationUnit.VISITOR } = experiment;
  const { identityMap } = context;
  const treatments = experiment.treatments.map((item) => item.id);
  const allocationPercentages = experiment.treatments.map((item) => item.allocationPercentage);  
  let treatmentAssignment = null;
  let identityId;
  switch (randomizationUnit) {
    case RandomizationUnit.VISITOR:
      identityId = identityMap[identityNamespace][0].id;
      treatmentAssignment = assignTreatmentByVisitor(experimentId, identityId, allocationPercentages, treatments);
      break;
    case RandomizationUnit.DEVICE:
      treatmentAssignment = assignTreatmentByDevice(experimentId, allocationPercentages, treatments);
      break;
    default:
      throw new Error('Unknown randomization unit');
  }
  return {
    experimentId,
    hashedBucket: treatmentAssignment.bucketId,
    treatment: {
      id: treatmentAssignment.treatmentId,
    },
  };
}

function traverseDecisionTree(decisionNodesMap, context, currentNodeId) {
  const { experiment, type } = decisionNodesMap[currentNodeId];
  if (type === 'EXPERIMENTATION') {
    const { treatment } = evaluateExperiment(context, experiment); // Destructuring the treatment here
    return [treatment];
  }
  return [];
}

function evaluateDecisionPolicy(decisionPolicy, context) {
  if (context.storage && context.storage instanceof Storage) {
   const storage = context.storage; // handle const assignment error
  }
  const decisionNodesMap = {};
  decisionPolicy.decisionNodes.forEach((item) => {
    decisionNodesMap[item.id] = item;
  });
  const items = traverseDecisionTree(decisionNodesMap, context, decisionPolicy.rootDecisionNodeId);
  return {
    items,
  };
}

export default { evaluateDecisionPolicy }; // Adjusted to prefer default export
