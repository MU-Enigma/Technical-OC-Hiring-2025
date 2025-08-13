using UnityEngine;
using UnityEngine.SceneManagement;

public class playerDeathHandler : MonoBehaviour
{
    // This method gets called by the animation event
    public void OnDeathAnimationComplete()
    {
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }
}