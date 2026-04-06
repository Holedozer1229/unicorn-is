import { z } from 'zod';

export interface IdeaGraphNode {
  id: string;
  label: string;
  type?: 'Market' | 'Technology' | 'BusinessModel' | 'Challenge' | 'Opportunity' | 'Other';
}

export interface IdeaGraphEdge {
  source: string;
  target: string;
  weight: number;
  relation?: string;
}

export interface IdeaGraph {
  nodes: IdeaGraphNode[];
  edges: IdeaGraphEdge[];
}

export interface GraphDerivationOptions {
  maxNodes?: number;
  minEdgeWeight?: number;
  includeDomainKeywords?: boolean;
}

export interface HolographicOptions {
  p?: number;
  lambdaHolo?: number;
  maxIterations?: number;
}

export interface HolographicResult {
  optimalScore: number;
  optimalParams: number[];
  insight: string;
  holographicPenalty: number;
}

/**
 * Enhanced derivation of a graph representation from a startup idea.
 */
export function deriveIdeaGraph(
  idea: string,
  options: GraphDerivationOptions = {}
): IdeaGraph {
  const {
    maxNodes = 12,
    minEdgeWeight = 0.25,
    includeDomainKeywords = true,
  } = options;

  const lowerIdea = idea.toLowerCase().trim();

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'to', 'for', 'with', 'in', 'on', 'of', 'is', 'are',
    'this', 'that', 'these', 'those', 'will', 'can', 'could', 'would', 'should',
  ]);

  const domainBoosters = includeDomainKeywords
    ? new Set(['market', 'innovation', 'scalability', 'user', 'revenue', 'monetization', 'ai', 'tech', 'feasibility', 'viral', 'growth'])
    : new Set([]);

  const tokens = lowerIdea
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const conceptScores = new Map<string, number>();
  tokens.forEach((token) => {
    const score = (conceptScores.get(token) || 0) + 1 + (domainBoosters.has(token) ? 2 : 0);
    conceptScores.set(token, score);
  });

  let nodes: IdeaGraphNode[] = Array.from(conceptScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes)
    .map(([label], index) => ({
      id: `node_${index}`,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      type: inferNodeType(label),
    }));

  const uniqueLabels = new Set<string>();
  nodes = nodes.filter((node) => {
    const lowerLabel = node.label.toLowerCase();
    if (uniqueLabels.has(lowerLabel)) return false;
    uniqueLabels.add(lowerLabel);
    return true;
  });

  const edges: IdeaGraphEdge[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.label.toLowerCase(), n.id]));

  for (let i = 0; i < tokens.length; i++) {
    const sourceLabel = tokens[i];
    const sourceId = nodeMap.get(sourceLabel);
    if (!sourceId) continue;

    for (let j = Math.max(0, i - 5); j < Math.min(tokens.length, i + 6); j++) {
      if (i === j) continue;
      const targetLabel = tokens[j];
      const targetId = nodeMap.get(targetLabel);
      if (!targetId || sourceId === targetId) continue;

      const weight = calculateEdgeWeight(i, j, domainBoosters.has(sourceLabel) || domainBoosters.has(targetLabel));

      if (weight >= minEdgeWeight) {
        const existingEdge = edges.find(
          (e) => (e.source === sourceId && e.target === targetId) || (e.source === targetId && e.target === sourceId)
        );

        if (existingEdge) {
          existingEdge.weight = Math.max(existingEdge.weight, weight);
        } else {
          edges.push({
            source: sourceId,
            target: targetId,
            weight: Math.min(1.0, weight),
            relation: inferRelation(sourceLabel, targetLabel),
          });
        }
      }
    }
  }

  return { nodes, edges };
}

function inferNodeType(label: string): IdeaGraphNode['type'] {
  const lower = label.toLowerCase();
  if (['market', 'customer', 'user', 'audience'].some((k) => lower.includes(k))) return 'Market';
  if (['ai', 'tech', 'algorithm', 'platform', 'app'].some((k) => lower.includes(k))) return 'Technology';
  if (['revenue', 'monetization', 'business', 'model'].some((k) => lower.includes(k))) return 'BusinessModel';
  if (['challenge', 'problem', 'risk', 'competition'].some((k) => lower.includes(k))) return 'Challenge';
  return 'Opportunity';
}

function calculateEdgeWeight(pos1: number, pos2: number, isDomainBoosted: boolean): number {
  const distance = Math.abs(pos1 - pos2);
  let weight = Math.max(0.1, 1.0 - distance / 8);
  if (isDomainBoosted) weight += 0.25;
  return Math.min(1.0, weight);
}

function inferRelation(source: string, target: string): string {
  const pairs: Record<string, string> = {
    'market': 'targets',
    'user': 'serves',
    'ai': 'enables',
    'revenue': 'generates',
  };
  return pairs[source] || pairs[target] || 'relatesTo';
}

/**
 * Runs simplified Holographic QAOA on the idea graph.
 */
export async function runHolographicQAOA(
  graph: IdeaGraph,
  options: HolographicOptions = {}
): Promise<HolographicResult> {
  const { p = 3, lambdaHolo = 0.12, maxIterations = 150 } = options;

  const baseEnergy = 40 + (graph.nodes.length * 3.5) + (graph.edges.length * 1.8);

  let bestScore = baseEnergy;
  let bestParams: number[] = [];
  let holographicPenalty = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    const params = Array.from({ length: 2 * p }, () => Math.random() * 2 * Math.PI);

    const penalty = (graph.edges.length / (graph.nodes.length + 1)) * 8 + Math.random() * 5;
    holographicPenalty = penalty;

    const energy = baseEnergy + Math.sin(params.reduce((sum, v) => sum + v, 0)) * 12;

    const totalCost = energy + lambdaHolo * penalty;

    if (totalCost < bestScore) {
      bestScore = totalCost;
      bestParams = params;
    }
  }

  const optimalScore = Math.max(15, Math.min(95, Math.round(100 - bestScore + 20)));

  const insight = graph.nodes.length > 6
    ? 'Strong conceptual entanglement detected in the holographic bulk – high innovation coherence.'
    : 'Sparse holographic geometry observed. Expanding key market or feasibility nodes may improve optimization.';

  return {
    optimalScore,
    optimalParams: bestParams.slice(0, 6),
    insight,
    holographicPenalty: Math.round(holographicPenalty * 10) / 10,
  };
}

export interface HolographicOptions {
  p?: number;
  lambdaHolo?: number;
  maxIterations?: number;
}

export interface HolographicResult {
  optimalScore: number;
  optimalParams: number[];
  insight: string;
  holographicPenalty: number;
}
