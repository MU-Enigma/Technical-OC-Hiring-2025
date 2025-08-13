using UnityEngine;

public class enemyShoot : MonoBehaviour
{
    public Transform firePoint;
    public Rigidbody2D bulletPrefab;
    public float bulletForce = 20f;

    [Header("Fire Settings")]
    public float fireInterval = 1f;
    private float shootTimer;

    [Header("References")]
    public Transform player;
    private enemyAi enemyAI;
    [SerializeField] private AudioClip enemyShootClip;

    void Start()
    {
        enemyAI = GetComponent<enemyAi>();
    }

    void Update()
    {
        if (enemyAI == null || player == null) return;

        if (enemyAI.chaseScript.enabled)
        {
            shootTimer += Time.deltaTime;

            if (shootTimer >= fireInterval)
            {
                ShootAtPlayer();
                shootTimer = 0f;
            }
        }
    }

    void ShootAtPlayer()
    {
        soundManager.instance.PlaySoundClip(enemyShootClip, transform, 1f);
        Vector2 direction = (player.position - firePoint.position).normalized;

        Rigidbody2D bullet = Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);
        bullet.AddForce(direction * bulletForce, ForceMode2D.Impulse);

        float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
        bullet.transform.rotation = Quaternion.Euler(0, 0, angle - 90f);
    }
}
