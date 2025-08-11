using UnityEngine;
using UnityEngine.UI;

public class enemyCount : MonoBehaviour
{
    public int remainingEnemies = 5;
    public Text enemyCountText;

    [ContextMenu("Decrease")]
    public void subtract()
    {
        if (remainingEnemies > 0)
        {
            remainingEnemies--;
        }
        remainingEnemies = Mathf.Max(remainingEnemies, 0);
        enemyCountText.text = remainingEnemies.ToString();
    }
    void Start()
    {
        enemyCountText.text = remainingEnemies.ToString();
    }
}
