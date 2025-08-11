using UnityEngine;
using System.Collections;

public class enemyAi : MonoBehaviour
{
    [Header("Detection Settings")]
    public Transform player;
    public float chaseRadius = 5f;
    public float escapeRadius = 8f;
    
    [Header("Behavior Scripts")]
    public MonoBehaviour patrolScript;
    public MonoBehaviour chaseScript;
    
    [Header("Music Manager")]
    public musicManager musicManager; // Reference to the music manager
    public LayerMask detectionLayers;
    
    private bool isFrozen = false;
    public bool IsFrozen => isFrozen;
    private bool isChasing = false;
    private bool hasNotifiedMusicManager = false; // Track if we've already notified music manager
    
    void Start()
    {
        EnablePatrol();
    }
    
    void Update()
    {
        if (isFrozen || player == null) return;
        
        Vector3 toPlayer = player.position - transform.position;
        float distanceToPlayer = toPlayer.magnitude;
        bool playerVisible = IsPlayerVisible(toPlayer);
        
        if (distanceToPlayer <= chaseRadius && playerVisible)
        {
            if (!isChasing)
            {
                isChasing = true;
                hasNotifiedMusicManager = true;
                if (musicManager != null)
                    musicManager.StartChase();
            }
            EnableChase();
        }
        else if (distanceToPlayer > escapeRadius)
        {
            if (isChasing)
            {
                isChasing = false;
                if (hasNotifiedMusicManager && musicManager != null)
                {
                    musicManager.StopChase();
                    hasNotifiedMusicManager = false;
                }
            }
            EnablePatrol();
        }
    }
    
    bool IsPlayerVisible(Vector3 directionToPlayer)
    {
        float distanceToPlayer = directionToPlayer.magnitude;
        RaycastHit2D obstacleHit = Physics2D.Raycast(transform.position, directionToPlayer.normalized, distanceToPlayer, LayerMask.GetMask("Obstacles"));
        return obstacleHit.collider == null && distanceToPlayer <= chaseRadius;
    }
    
    void EnablePatrol()
    {
        if (patrolScript != null && !patrolScript.enabled)
        {
            patrolScript.enabled = true;
            if (chaseScript != null) chaseScript.enabled = false;
        }
    }
    
    void EnableChase()
    {
        if (chaseScript != null && !chaseScript.enabled)
        {
            chaseScript.enabled = true;
            if (patrolScript != null) patrolScript.enabled = false;
        }
    }
    
    public void Freeze(float duration)
    {
        if (!isFrozen)
        {
            isFrozen = true;
            Rigidbody2D rb = GetComponent<Rigidbody2D>();
            if (rb != null) rb.linearVelocity = Vector2.zero;
            
            if (patrolScript != null) patrolScript.enabled = false;
            if (chaseScript != null) chaseScript.enabled = false;
            
            // Stop chase music when frozen
            if (isChasing && hasNotifiedMusicManager && musicManager != null)
            {
                musicManager.StopChase();
                hasNotifiedMusicManager = false;
                isChasing = false;
            }
            
            StartCoroutine(FreezeRoutine(duration));
        }
    }
    
    private IEnumerator FreezeRoutine(float duration)
    {
        yield return new WaitForSeconds(duration);
        isFrozen = false;
        Update(); // Re-evaluate state after unfreezing
    }
    
    // Called when enemy is destroyed - ensures music manager is properly notified
    void OnDestroy()
    {
        if (isChasing && hasNotifiedMusicManager && musicManager != null)
        {
            musicManager.StopChase();
        }
    }
    
    void OnDrawGizmosSelected()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(transform.position, chaseRadius);
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, escapeRadius);
    }
}