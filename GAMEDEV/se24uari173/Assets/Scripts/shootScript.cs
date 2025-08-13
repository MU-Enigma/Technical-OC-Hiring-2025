using UnityEngine;

public class shootScript : MonoBehaviour
{
    public Transform firePoint;
    public Rigidbody2D bulletPrefab;
    public float bulletForce = 20f;
    public float shootCooldown = 3f;
    [HideInInspector] public float cooldownTimer = 0f;
    [SerializeField] private AudioClip shootSound;

    void Update()
    {
        if (cooldownTimer > 0f)
        {
            cooldownTimer = cooldownTimer - Time.deltaTime;
            if (cooldownTimer <= 0f)
            {
                cooldownTimer = 0f;
                Debug.Log("Can shoot");
            }
        }

        if (cooldownTimer == 0f && Input.GetMouseButtonDown(0))
        {
            soundManager.instance.PlaySoundClip(shootSound, transform, 1f);
            Shoot();
        }
    }

    void Shoot()
    {
        Rigidbody2D bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
        bullet.AddForce(firePoint.up * bulletForce, ForceMode2D.Impulse);
    }

    public void StartCooldown()
    {
        cooldownTimer = shootCooldown;
        Debug.Log("Can't shoot");
    }
}
