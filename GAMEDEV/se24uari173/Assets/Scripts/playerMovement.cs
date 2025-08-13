using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class playerMovement : MonoBehaviour
{
    [Header("Movement")]
    public Rigidbody2D player;
    public float speed = 5f;

    [Header("Dash")]
    public float dashPower = 15f;
    public float dashDuration = 0.2f;
    public float dashCooldown = 1f;

    [Header("Time Slow")]
    public float slowTimeScale = 0.3f;
    public float dashTimeScale = 0.6f;
    public float maxSlowDuration = 5f;

    private float slowTimeHeld = 0f;

    [Header("Post Processing")]
    public Volume volume;

    private ChromaticAberration chroma;
    private ColorAdjustments colorAdjust;
    private Vector2 moveInput;
    private bool isDashing = false;
    private bool canDash = true;
    private float dashTimer = 0f;
    private float dashCooldownTimer = 0f;
    private bool timeSlow = false;
    private Vector2 dashDirection;
    void Start()
    {
        InitializePostProcessing();
    }

    void Update()
    {
        HandleMovementInput();
        HandleMouseRotation();
        HandleDashInput();
        HandleTimeSlowInput();
        HandleDashTimers();
    }

    void FixedUpdate()
    {
        HandleMovement();
    }

    void InitializePostProcessing()
    {
        volume.profile.TryGet(out chroma);
        volume.profile.TryGet(out colorAdjust);
    }

    void HandleMovementInput()
    {
        float xInput = Input.GetAxisRaw("Horizontal");
        float yInput = Input.GetAxisRaw("Vertical");
        moveInput = new Vector2(xInput, yInput).normalized;
    }

    void HandleMouseRotation()
    {
        Vector2 screenCenter = new Vector2(Screen.width / 2f, Screen.height / 2f);
        Vector2 mousePos = Input.mousePosition;
        Vector2 screenDir = (mousePos - screenCenter).normalized;

        float angle = Mathf.Atan2(screenDir.y, screenDir.x) * Mathf.Rad2Deg;
        player.rotation = angle - 90f;
    }

    void HandleDashInput()
    {
        if (Input.GetKeyDown(KeyCode.Space) && canDash && moveInput != Vector2.zero)
        {
            StartDash();
        }
    }

    void HandleTimeSlowInput()
    {
        if (Input.GetKey(KeyCode.LeftShift) && slowTimeHeld < maxSlowDuration)
        {
            timeSlow = true;
            slowTimeHeld += Time.unscaledDeltaTime;
            float targetTimeScale = GetTimeSlowScale();
            SetTimeSlow(true, targetTimeScale);
        }
        else
        {
            timeSlow = false;
            SetTimeSlow(false, 1f);

            // Only reset timer when shift key is actually released
            if (!Input.GetKey(KeyCode.LeftShift))
            {
                slowTimeHeld = 0f;
            }
        }
    }


    void SetTimeSlow(bool state, float customScale)
    {
        if (state)
        {
            EnableTimeSlow(customScale);
        }
        else
        {
            DisableTimeSlow();
        }
    }
    float GetTimeSlowScale()
    {
        if (isDashing)
        {
            return dashTimeScale;
        }
        else
        {
            return slowTimeScale;
        }
    }

    void HandleMovement()
    {
        if (isDashing)
        {
            player.linearVelocity = dashDirection * dashPower;
        }
        else
        {
            player.linearVelocity = moveInput * speed;
        }
    }

    void StartDash()
    {
        isDashing = true;
        canDash = false;
        dashDirection = moveInput;
        dashTimer = 0f;
        dashCooldownTimer = 0f;
    }

    void HandleDashTimers()
    {
        HandleDashDuration();
        HandleDashCooldown();
    }

    void HandleDashDuration()
    {
        if (!isDashing) return;

        dashTimer += Time.deltaTime;
        float currentDashDuration = GetCurrentDashDuration();

        if (dashTimer >= currentDashDuration)
        {
            isDashing = false;
        }
    }

    float GetCurrentDashDuration()
    {
        if (timeSlow)
        {
            return dashDuration - 0.1f;
        }
        else
        {
            return dashDuration;
        }
    }

    void HandleDashCooldown()
    {
        if (canDash) return;

        dashCooldownTimer += Time.unscaledDeltaTime;

        if (dashCooldownTimer >= dashCooldown)
        {
            canDash = true;
        }
    }


    void EnableTimeSlow(float customScale)
    {
        Time.timeScale = customScale;
        Time.fixedDeltaTime = 0.02f * Time.timeScale;
        SetChromaticAberration(1f);
        SetColorSaturation(-50f);

        // Slow down sounds based on time scale
        soundManager.instance.SetGlobalPitch(customScale);
    }

    void DisableTimeSlow()
    {
        Time.timeScale = 1f;
        Time.fixedDeltaTime = 0.02f;
        SetChromaticAberration(0f);
        SetColorSaturation(0f);

        // Reset sound pitch to normal
        soundManager.instance.SetGlobalPitch(1f);
    }


    void SetChromaticAberration(float intensity)
    {
        if (chroma != null)
        {
            chroma.intensity.value = intensity;
        }
    }

    void SetColorSaturation(float saturation)
    {
        if (colorAdjust != null)
        {
            colorAdjust.saturation.value = saturation;
        }
    }
}
