using UnityEngine;
using UnityEngine.SceneManagement; // Required for Restart

public class winScript : MonoBehaviour
{
    public GameObject winObject;
    public enemyCount enemyCounter;

    void Start()
    {
        if (winObject != null)
            winObject.SetActive(false);

        if (enemyCounter == null)
            enemyCounter = FindAnyObjectByType<enemyCount>();
    }

    void Update()
    {
        if (enemyCounter != null && enemyCounter.remainingEnemies <= 0)
        {
            winObject.SetActive(true);
        }
    }

    public void RestartGame()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }

    public void QuitGame()
    {
        Application.Quit();
    }
}
