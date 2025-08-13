using UnityEngine;
using Pathfinding;

public class escScript : MonoBehaviour
{
    public CircleCollider2D triggerCollider;
    public GameObject uiObject;
    private bool isPaused = false;
    private AIPath[] allAIPaths;

    void Start()
    {
        if (uiObject != null)
            uiObject.SetActive(false);
        
        Time.timeScale = 1f;
        allAIPaths = FindObjectsByType<AIPath>(FindObjectsSortMode.None);
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            TogglePause();
        }
    }

    void TogglePause()
    {
        isPaused = !isPaused;
        
        if (uiObject != null)
            uiObject.SetActive(isPaused);
            
        Time.timeScale = isPaused ? 0f : 1f;
        
        foreach (AIPath aiPath in allAIPaths)
        {
            if (aiPath != null)
                aiPath.canMove = !isPaused;
        }
        

    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Player"))
        {
            if (!isPaused)
                TogglePause();
        }
    }
}