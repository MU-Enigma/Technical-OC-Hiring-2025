using UnityEngine;

public class bulletSpawner : MonoBehaviour
{
    [Header("Bullet Settings")]
    public GameObject bulletPrefab;
    public int bulletCount = 5;

    [Header("Spawn Points")]
    public Transform[] spawnPoints;
    void Start()
    {
        SpawnBullets();
    }

    void SpawnBullets()
    {
        if (spawnPoints.Length == 0 || bulletPrefab == null) return;

        for (int i = 0; i < bulletCount; i++)
        {
            int randomIndex = Random.Range(0, spawnPoints.Length);
            Transform spawnPoint = spawnPoints[randomIndex];

            Instantiate(bulletPrefab, spawnPoint.position, spawnPoint.rotation);
        }
    }
}
