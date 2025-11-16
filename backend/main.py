from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # or ["http://localhost:3000"] for more strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineData(BaseModel):
    nodes: List[Dict]
    edges: List[Dict]

def is_dag(edges, nodes):
    # Build adjacency list
    graph = {node["id"]: [] for node in nodes}
    for e in edges:
        graph[e["source"]].append(e["target"])

    visited = {}
    visiting = set()

    def dfs(node):
        if node in visiting:
            return False  # cycle detected
        if node in visited:
            return True   # already processed

        visiting.add(node)
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        visiting.remove(node)
        visited[node] = True
        return True

    # Run DFS for all nodes
    for node in graph.keys():
        if node not in visited:
            if not dfs(node):
                return False

    return True

@app.post("/pipelines/parse")
def parse_pipeline(data: PipelineData):
    num_nodes = len(data.nodes)
    num_edges = len(data.edges)
    dag = is_dag(data.edges, data.nodes)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag
    }
