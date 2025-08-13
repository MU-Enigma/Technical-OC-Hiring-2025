using UnityEngine;

public class enemyAnimations : MonoBehaviour
{
    public Animator animator;
    private enemyAi enemyAI;

    void Start()
    {
        enemyAI = GetComponentInParent<enemyAi>();
        
        if (animator == null)
            animator = GetComponent<Animator>();
    }

    void Update()
    {
        if (enemyAI != null && animator != null)
        {
            bool isStunned = enemyAI.IsFrozen;
            animator.SetBool("isStun", isStunned);
            
            if (isStunned)
                Debug.Log("Enemy is stunned - setting isStun to true");
        }
        else
        {
            if (enemyAI == null)
                Debug.LogError("enemyAI component not found on parent object!");
            if (animator == null)
                Debug.LogError("Animator component not found!");
        }
    }
}
