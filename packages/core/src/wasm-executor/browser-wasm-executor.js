import * as Comlink from 'comlink'
import * as pkg from '@acala-network/chopsticks-executor'

const getRuntimeVersion = async (code) => {
  return pkg.get_runtime_version(code)
}

// trie_version: 0 for old trie, 1 for new trie
const calculateStateRoot = async (entries, trie_version) => {
  return pkg.calculate_state_root(entries, trie_version)
}

const decodeProof = async (trieRootHash, keys, nodes) => {
  return pkg.decode_proof(trieRootHash, keys, nodes)
}

const createProof = async (nodes, entries) => {
  return pkg.create_proof(nodes, entries)
}

const runTask = async (task, callback) => {
  return pkg.run_task(task, callback, 'info')
}

const wasmExecutor = { runTask, getRuntimeVersion, calculateStateRoot, createProof, decodeProof }

Comlink.expose(wasmExecutor)
