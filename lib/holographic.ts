import { z } from 'zod';

export interface IdeaGraphNode {
  id: string;
  label: string;
  type?: 'Market' | 'Technology' | 'BusinessModel' | 'Challenge' | 'Opportunity' | 'Other';
}

export interface IdeaGraphEdge {
  source: string;
  target: string;
  weight: number;           // 0.0 - 1.0, higher = stronger relation
  relation?: string;        // e.g., "enables", "targets", "dependsOn"
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

/**
 * Enhanced derivation of a graph representation from a startup idea.
 * Nodes represent key concepts; edges capture semantic and contextual relationships.
 * Optimized for holographic QAOA by emphasizing structural coherence and entanglement.
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

  // Expanded startup-domain stop words and common noise
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'to', 'for', 'with', 'in', 'on', 'of', 'is', 'are',
    'this', 'that', 'these', 'those', 'will', 'can', 'could', 'would', 'should',
    'startup', 'idea', 'app', 'platform', 'service', 'product', // generic unless contextual
  ]);

  // Domain-specific booster keywords for startup ideas
  const domainBoosters = includeDomainKeywords
    ? new Set(['market', 'innovation', 'scalability', 'user', 'revenue', 'monetization', 'ai', 'tech', 'feasibility', 'viral', 'growth', 'competition'])
    : new Set([]);

  // Tokenize and extract candidate concepts
  const tokens = lowerIdea
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  // Score and deduplicate concepts (frequency + domain boost)
  const conceptScores = new Map<string, number>();
  tokens.forEach((token, index) => {
    const score = (conceptScores.get(token) || 0) + 1 + (domainBoosters.has(token) ? 2 : 0);
    conceptScores.set(token, score);
  });

  // Select top concepts as nodes
  let nodes: IdeaGraphNode[] = Array.from(conceptScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes)
    .map(([label], index) => ({
      id: `node_${index}`,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      type: inferNodeType(label),
    }));

  // Deduplicate by label (case-insensitive)
  const uniqueLabels = new Set<string>();
  nodes = nodes.filter((node) => {
    const lowerLabel = node.label.toLowerCase();
    if (uniqueLabels.has(lowerLabel)) return false;
    uniqueLabels.add(lowerLabel);
    return true;
  });

  // Build edges with semantic weighting
  const edges: IdeaGraphEdge[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.label.toLowerCase(), n.id]));

  for (let i = 0; i < tokens.length; i++) {
    const sourceLabel = tokens[i];
    const sourceId = nodeMap.get(sourceLabel);
    if (!sourceId) continue;

    // Proximity-based edges (co-occurrence within window)
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

/** Simple heuristic for node type classification (expandable via SphinxOS prompt). */
function inferNodeType(label: string): IdeaGraphNode['type'] {
  const lower = label.toLowerCase();
  if (['market', 'customer', 'user', 'audience'].some((k) => lower.includes(k))) return 'Market';
  if (['ai', 'tech', 'algorithm', 'platform', 'app'].some((k) => lower.includes(k))) return 'Technology';
  if (['revenue', 'monetization', 'business', 'model'].some((k) => lower.includes(k))) return 'BusinessModel';
  if (['challenge', 'problem', 'risk', 'competition'].some((k) => lower.includes(k))) return 'Challenge';
  return 'Opportunity';
}

/** Calculate edge weight based on proximity and domain relevance. */
function calculateEdgeWeight(pos1: number, pos2: number, isDomainBoosted: boolean): number {
  const distance = Math.abs(pos1 - pos2);
  let weight = Math.max(0.1, 1.0 - distance / 8); // Closer = stronger
  if (isDomainBoosted) weight += 0.25;
  return Math.min(1.0, weight);
}

/** Infer basic relation type (expand with SphinxOS for richer semantics). */
function inferRelation(source: string, target: string): string {
  const pairs: Record<string, string> = {
    'market': 'targets',
    'user': 'serves',
    'ai': 'enables',
    'revenue': 'generates',
  };
  return pairs[source] || pairs[target] || 'relatesTo';
}
