using UnityEngine;

namespace Pathfinding
{
    [UniqueComponent(tag = "ai.destination")]
    public class randomPatrol : VersionedMonoBehaviour
    {
        [Header("Random Patrol Area")]
        public Vector2 patrolAreaCenter = Vector2.zero;
        public Vector2 patrolAreaSize = new Vector2(10, 10);
        public float delay = 0f;

        IAstarAI agent;
        float switchTime = float.PositiveInfinity;

        protected override void Awake()
        {
            base.Awake();
            agent = GetComponent<IAstarAI>();
        }

        void Update()
        {
            if (agent == null) return;

            if (!agent.hasPath && float.IsPositiveInfinity(switchTime))
            {
                Vector3 randomPoint = GetRandomNavmeshPoint();
                agent.destination = randomPoint;
                agent.SearchPath();
            }

            if (agent.reachedEndOfPath && !agent.pathPending && float.IsPositiveInfinity(switchTime))
            {
                switchTime = Time.time + delay;
            }

            if (Time.time >= switchTime)
            {
                Vector3 randomPoint = GetRandomNavmeshPoint();
                agent.destination = randomPoint;
                agent.SearchPath();
                switchTime = float.PositiveInfinity;
            }
        }

        Vector3 GetRandomNavmeshPoint()
        {
            Vector2 randomInBox = patrolAreaCenter + new Vector2(
                Random.Range(-patrolAreaSize.x / 2f, patrolAreaSize.x / 2f),
                Random.Range(-patrolAreaSize.y / 2f, patrolAreaSize.y / 2f)
            );

            var nearest = AstarPath.active.GetNearest(randomInBox, NNConstraint.Default);
            return nearest.position;
        }

        void OnDrawGizmosSelected()
        {
            Gizmos.color = Color.cyan;
            Gizmos.DrawWireCube(patrolAreaCenter, patrolAreaSize);
        }
    }
}
