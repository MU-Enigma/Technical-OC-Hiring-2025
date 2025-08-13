using UnityEngine;

public class animationDestroy : MonoBehaviour
{
    public void DestroySelf()
    {
        if (gameObject != null)
            Destroy(gameObject);
    }
}